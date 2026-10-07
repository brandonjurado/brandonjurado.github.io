import {spawn} from "node:child_process";
import {mkdir, writeFile} from "node:fs/promises";
import assert from "node:assert/strict";
import {chromium} from "playwright";
import AxeBuilder from "@axe-core/playwright";

async function assertNoOverflow(page, label) {
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    ),
    `document overflow: ${label}`
  );
}

async function checkAccessibility(page, label) {
  const axe = await new AxeBuilder({page})
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  assert.deepEqual(
    axe.violations.map(violation => ({
      id: violation.id,
      targets: violation.nodes.map(node => node.target)
    })),
    [],
    `accessibility: ${label}`
  );
  return axe.violations.length;
}

async function assertDisclosureState(
  page,
  disclosure,
  open,
  explicitAria = false
) {
  const element = await disclosure.elementHandle();
  try {
    await page.waitForFunction(
      ({element, open, explicitAria}) =>
        element.open === open &&
        (!explicitAria ||
          element.querySelector("summary").getAttribute("aria-expanded") ===
            String(open)),
      {element, open, explicitAria}
    );
  } finally {
    await element.dispose();
  }
}

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
    await assertNoOverflow(page, width);
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
    for (const id of ["greeting", "systems", "experience", "contact"]) {
      await page.locator(`.navigation a[href="#${id}"]`).click();
      assert.equal(new URL(page.url()).hash, `#${id}`);
      await page.waitForFunction(target => {
        const rect = document.getElementById(target).getBoundingClientRect();
        return rect.top >= -1 && rect.top < innerHeight;
      }, id);
    }
    const axeViolations = await checkAccessibility(page, `${width}, collapsed`);

    await page.locator('.navigation a[href="#systems"]').click();
    const notifications = page.getByRole("tab", {
      name: "Notifications",
      exact: true
    });
    await notifications.click();
    await notifications.focus();
    const systemScrollY = await page.evaluate(() => scrollY);
    for (const [key, label] of [
      ["ArrowRight", "Identity"],
      ["ArrowRight", "Billing"],
      ["ArrowLeft", "Identity"],
      ["End", "Booking"],
      ["Home", "Notifications"],
      ["ArrowLeft", "Booking"],
      ["ArrowRight", "Notifications"]
    ]) {
      await page.keyboard.press(key);
      const tab = page.getByRole("tab", {name: label, exact: true});
      assert.equal(
        await tab.getAttribute("aria-selected"),
        "true",
        `${key}: ${label}`
      );
      assert.equal(await tab.getAttribute("tabindex"), "0");
      assert.ok(
        await tab.evaluate(element => element === document.activeElement)
      );
      assert.equal(
        await page.locator('[role="tab"][aria-selected="true"]').count(),
        1
      );
      assert.equal(await page.locator('[role="tab"][tabindex="0"]').count(), 1);
      const panel = page.locator(`#${await tab.getAttribute("aria-controls")}`);
      assert.ok(await panel.isVisible(), `${label}: corresponding panel`);
      assert.equal(
        await panel.getAttribute("aria-labelledby"),
        await tab.getAttribute("id")
      );
      assert.equal(await page.getByRole("tabpanel").count(), 1);
      await assertNoOverflow(page, `${width}, ${label}`);
      if (width <= 390) {
        assert.ok(
          Math.abs((await page.evaluate(() => scrollY)) - systemScrollY) < 2,
          `${width}: keyboard tab changes must not scroll the document`
        );
        const tabBounds = await tab.boundingBox();
        const listBounds = await page.getByRole("tablist").boundingBox();
        assert.ok(tabBounds.x >= listBounds.x - 1);
        assert.ok(
          tabBounds.x + tabBounds.width <= listBounds.x + listBounds.width + 1
        );
      }
    }
    const representativeTab = {
      320: "Identity",
      390: "Billing",
      768: "Booking",
      1440: "Notifications"
    }[width];
    await page.getByRole("tab", {name: representativeTab, exact: true}).click();

    await page.locator('.navigation a[href="#experience"]').click();
    const careerRole = page.locator("#experience details").first();
    const careerSummary = careerRole.locator("summary");
    const careerPanel = page.locator(
      `#${await careerSummary.getAttribute("aria-controls")}`
    );
    await assertDisclosureState(page, careerRole, false, true);
    for (const [key, open] of [
      ["Enter", true],
      ["Space", false],
      ["Enter", true]
    ]) {
      await careerSummary.focus();
      await page.keyboard.press(key);
      await assertDisclosureState(page, careerRole, open, true);
      assert.equal(await careerPanel.isVisible(), open);
    }

    const moreBuilds = page.locator("#additional-projects");
    const moreSummary = moreBuilds.locator("summary");
    await assertDisclosureState(page, moreBuilds, false);
    for (const [key, open] of [
      ["Enter", true],
      ["Space", false],
      ["Enter", true]
    ]) {
      await moreSummary.focus();
      await page.keyboard.press(key);
      await assertDisclosureState(page, moreBuilds, open);
      assert.equal(await moreBuilds.locator("a").first().isVisible(), open);
    }
    await assertNoOverflow(page, `${width}, expanded content`);
    const expandedAxeViolations = await checkAccessibility(
      page,
      `${width}, ${representativeTab}, expanded career and more builds`
    );
    results.push({
      width,
      axeViolations,
      expandedAxeViolations,
      representativeTab
    });
    await careerSummary.focus();
    await page.keyboard.press("Enter");
    await assertDisclosureState(page, careerRole, false, true);
    await moreSummary.focus();
    await page.keyboard.press("Enter");
    await assertDisclosureState(page, moreBuilds, false);
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
  for (const id of [
    "greeting",
    "skills",
    "systems",
    "experience",
    "notes",
    "off-the-clock",
    "achievements",
    "education",
    "contact"
  ])
    assert.ok(await nojs.locator(`#${id}`).isVisible());
  assert.ok(
    await nojs
      .getByRole("navigation", {name: "Primary", exact: true})
      .isVisible()
  );
  assert.equal(await nojs.getByRole("tabpanel").count(), 4);
  for (const panel of await nojs.getByRole("tabpanel").all())
    assert.ok(await panel.isVisible());
  assert.equal(await nojs.getByRole("tablist").isVisible(), false);
  const nojsCareer = nojs.locator("#experience details").first();
  await nojsCareer.locator("summary").focus();
  await nojs.keyboard.press("Enter");
  await assertDisclosureState(nojs, nojsCareer, true);
  assert.ok(await nojsCareer.locator(".experience-text-desc").isVisible());
  await nojs.keyboard.press("Space");
  await assertDisclosureState(nojs, nojsCareer, false);
  const nojsMore = nojs.locator("#additional-projects");
  await nojsMore.locator("summary").focus();
  await nojs.keyboard.press("Enter");
  await assertDisclosureState(nojs, nojsMore, true);
  assert.ok(await nojsMore.locator("a").first().isVisible());
  await nojs.keyboard.press("Space");
  await assertDisclosureState(nojs, nojsMore, false);
  await assertNoOverflow(nojs, "no JavaScript, 390");
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
        noJSSystemPanels: 4,
        keyboardSystems: true,
        nativeCareerDisclosures: true,
        nativeMoreBuilds: true,
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
    "Browser checks passed: four widths, axe in collapsed/expanded states, keyboard anchors/tabs/disclosures, no-JS panels/details, hydration, motion preferences/offscreen, résumé, 404, CSP"
  );
} finally {
  await browser?.close();
  server.kill();
}
