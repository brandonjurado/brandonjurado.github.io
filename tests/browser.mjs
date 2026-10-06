import {spawn} from "node:child_process";
import {mkdir, writeFile} from "node:fs/promises";
import assert from "node:assert/strict";
import {chromium} from "playwright";
import AxeBuilder from "@axe-core/playwright";

const server = spawn(process.execPath, ["scripts/preview-server.mjs"], {
  env: {...process.env, PORT: "4181"},
  stdio: "ignore"
});
const url = "http://127.0.0.1:4181";
let browser;
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try {
      await fetch(url);
      ready = true;
      break;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  assert.ok(ready, "Preview server did not start");
  browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    headless: true
  });
  const context = await browser.newContext({
    viewport: {width: 390, height: 844},
    reducedMotion: "reduce"
  });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  assert.equal(await page.locator(".theme-toggle").count(), 0);
  assert.equal(await page.locator("h1").count(), 1);
  await page.keyboard.press("Tab");
  assert.equal(await page.locator(":focus").textContent(), "Skip to content");
  await page.keyboard.press("Enter");
  assert.equal(new URL(page.url()).hash, "#main-content");

  const results = [];
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({width, height: 900});
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      ),
      `overflow at ${width}`
    );
    const styles = await page.evaluate(() => {
      const heading = getComputedStyle(document.querySelector("h1"));
      const wordmark = document.querySelector(".footer-wordmark");
      return {
        font: heading.fontFamily,
        weight: heading.fontWeight,
        wordmarkFits:
          Math.abs(
            wordmark.querySelector("text").getComputedTextLength() - 1280
          ) < 1
      };
    });
    assert.match(styles.font, /Inter/);
    assert.equal(styles.weight, "400");
    assert.ok(styles.wordmarkFits, `footer wordmark fits at ${width}`);
    for (const id of ["greeting", "skills", "experience", "contact"]) {
      await page.locator(`.navigation a[href="#${id}"]`).click();
      assert.equal(new URL(page.url()).hash, `#${id}`);
      await page.waitForFunction(target => {
        const rect = document.getElementById(target).getBoundingClientRect();
        return rect.top >= -1 && rect.top < innerHeight;
      }, id);
    }
    const axe = await new AxeBuilder({page})
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    assert.deepEqual(
      axe.violations.map(v => ({
        id: v.id,
        targets: v.nodes.map(n => n.target)
      })),
      [],
      `accessibility at ${width}`
    );
    results.push({width, axeViolations: axe.violations.length});
  }
  const resume = await fetch(`${url}/resume.pdf`);
  assert.equal(resume.status, 404);
  assert.equal(await page.locator('a[href="/resume.pdf"]').count(), 0);
  assert.deepEqual(errors, [], "Hydration and console errors");
  await page.close();

  const nojs = await browser.newPage({
    javaScriptEnabled: false,
    viewport: {width: 390, height: 844}
  });
  await nojs.goto(url);
  assert.equal(await nojs.locator("html").getAttribute("data-theme"), "dark");
  for (const id of ["greeting", "skills", "experience", "contact"])
    assert.ok(await nojs.locator(`#${id}`).isVisible());
  assert.ok(
    await nojs
      .getByRole("navigation", {name: "Primary", exact: true})
      .isVisible()
  );
  await nojs.close();

  for (const preference of ["reduce", "save-data", "normal"]) {
    const motion = await browser.newPage({
      viewport: {width: 1440, height: 900},
      reducedMotion: preference === "reduce" ? "reduce" : "no-preference"
    });
    motion.setDefaultTimeout(5000);
    if (preference === "save-data")
      await motion.addInitScript(() =>
        Object.defineProperty(navigator, "connection", {
          value: {saveData: true}
        })
      );
    await motion.goto(url);
    await motion.waitForFunction(
      expected =>
        document.querySelector(".request-trace")?.dataset.motion === expected,
      preference === "normal" ? "running" : "static"
    );
    if (preference === "normal") {
      await motion.locator("#contact").scrollIntoViewIfNeeded();
      await motion.waitForFunction(
        () =>
          document.querySelector(".request-trace")?.dataset.motion === "paused"
      );
    } else {
      assert.equal(
        await motion
          .locator(".request-trace__packet")
          .first()
          .evaluate(el => getComputedStyle(el).display),
        "none"
      );
    }
    await motion.close();
  }

  const missing = await browser.newPage();
  const response = await missing.goto(`${url}/missing-page`);
  assert.equal(response.status(), 404);
  assert.equal(await missing.locator("h1").textContent(), "Page not found");
  await missing.close();
  assert.ok((await fetch(url)).headers.get("content-security-policy"));
  await mkdir("reports", {recursive: true});
  await writeFile(
    "reports/browser.json",
    JSON.stringify(
      {
        results,
        hydrationErrors: errors,
        noJS: true,
        staticPreferences: true,
        offscreenPause: true,
        resumeUnpublished: true,
        real404: true
      },
      null,
      2
    )
  );
  console.log(
    "Browser checks passed: four widths, axe, hydration, keyboard anchors, no-JS, motion preferences/offscreen, résumé, 404, CSP"
  );
} finally {
  await browser?.close();
  server.kill();
}
