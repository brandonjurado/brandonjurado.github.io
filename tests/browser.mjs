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
  const results = [];
  const contrastFailures = [];
  for (const colorScheme of ["light", "dark"]) {
    const context = await browser.newContext({
      viewport: {width: 390, height: 844},
      colorScheme
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(url);
    assert.equal(await page.getByRole("button", {name: /^Pause /}).count(), 0);
    assert.equal(await page.locator(".social-media-div a svg").count(), 6);
    await page.getByRole("button", {name: "Menu", exact: true}).click();
    assert.equal(
      await page
        .getByRole("button", {name: "Menu", exact: true})
        .getAttribute("aria-expanded"),
      "true"
    );
    const themeToggle = page.getByRole("button", {name: /Color theme:/});
    const checkThemeVisual = async theme =>
      page.waitForFunction(expected => {
        const toggle = document.querySelector(".theme-toggle");
        const thumb = toggle.querySelector(".theme-thumb");
        const track = toggle.querySelector(".theme-track");
        const offset =
          thumb.getBoundingClientRect().left -
          track.getBoundingClientRect().left;
        return (
          toggle.dataset.theme === expected &&
          thumb.textContent === (expected === "dark" ? "🌜" : "☀️") &&
          Math.abs(offset - (expected === "dark" ? 22 : 0)) < 0.1
        );
      }, theme);
    assert.equal(await themeToggle.getAttribute("data-theme"), "dark");
    await checkThemeVisual("dark");
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.emulateMedia({
      colorScheme: colorScheme === "dark" ? "light" : "dark"
    });
    assert.equal(await themeToggle.getAttribute("data-theme"), "dark");
    await checkThemeVisual("dark");
    await themeToggle.click();
    assert.equal(
      await page.locator("html").getAttribute("data-theme"),
      "light"
    );
    await page.reload();
    await page.getByRole("button", {name: "Menu", exact: true}).click();
    await page
      .getByRole("button", {name: "Color theme: light. Change theme"})
      .waitFor();
    await themeToggle.click();
    await checkThemeVisual("dark");
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await page.reload();
    await page.getByRole("button", {name: "Menu", exact: true}).click();
    await page
      .getByRole("button", {name: "Color theme: dark. Change theme"})
      .waitFor();
    await themeToggle.press("Escape");
    assert.equal(
      await page
        .getByRole("button", {name: "Menu", exact: true})
        .getAttribute("aria-expanded"),
      "false"
    );
    // Exercise each explicit theme; new visitors always default to dark.
    await page.evaluate(
      theme => localStorage.setItem("theme", theme),
      colorScheme
    );
    await page.reload();
    await page.keyboard.press("Tab");
    assert.equal(await page.locator(":focus").textContent(), "Skip to content");
    await page.keyboard.press("Enter");
    assert.equal(new URL(page.url()).hash, "#main-content");
    await page.evaluate(() => document.fonts.ready);
    const restoredStyles = await page.evaluate(() => {
      const style = selector =>
        getComputedStyle(document.querySelector(selector));
      return {
        introFont: style(".greeting-text").fontFamily,
        introSize: style(".greeting-text").fontSize,
        cardPadding: style(".certificate-card").padding,
        projectPadding: style(".ap-card").padding,
        footerBackground: style(".footer-shell").backgroundImage,
        footerGlow: style(".footer-shell-glow").display,
        marquee: style(".landing-marquee").display,
        introColor: style(".greeting-text").color,
        introButtonPadding: style(".button-greeting-div .main-button").padding,
        introButtonSize: style(".button-greeting-div .main-button").fontSize,
        introButtonMinHeight: style(".button-greeting-div .main-button")
          .minHeight
      };
    });
    assert.match(restoredStyles.introFont, /Saira Extra Condensed/);
    assert.equal(restoredStyles.introSize, "48px");
    assert.equal(restoredStyles.cardPadding, "24px");
    assert.equal(restoredStyles.projectPadding, "14.4px 16px");
    assert.match(restoredStyles.footerBackground, /linear-gradient/);
    assert.notEqual(restoredStyles.footerGlow, "none");
    assert.notEqual(restoredStyles.marquee, "none");
    assert.equal(restoredStyles.introColor, "rgb(85, 25, 139)");
    assert.equal(restoredStyles.introButtonPadding, "12px 18px");
    assert.equal(restoredStyles.introButtonSize, "15.008px");
    assert.equal(restoredStyles.introButtonMinHeight, "0px");
    const smallTargets = await page
      .locator("a,button")
      .evaluateAll(elements => {
        const targets = elements
          .map(element => ({element, rect: element.getBoundingClientRect()}))
          .filter(({rect}) => rect.width > 0 && rect.height > 0);
        return targets
          .filter(({element, rect}) => {
            if (rect.width >= 24 && rect.height >= 24) return false;
            const x = rect.x + rect.width / 2,
              y = rect.y + rect.height / 2;
            return targets.some(
              other =>
                other.element !== element &&
                Math.hypot(
                  x - other.rect.x - other.rect.width / 2,
                  y - other.rect.y - other.rect.height / 2
                ) < 24
            );
          })
          .map(({element}) => element.textContent);
      });
    assert.deepEqual(smallTargets, [], "24px targets or 24px center spacing");
    const axe = await new AxeBuilder({page})
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    contrastFailures.push(
      ...axe.violations
        .filter(v => v.id === "color-contrast")
        .map(v => ({theme: colorScheme, nodes: v.nodes.map(n => n.target)}))
    );
    assert.deepEqual(
      axe.violations
        .filter(v => v.id !== "color-contrast")
        .map(v => ({id: v.id, nodes: v.nodes.map(n => n.target)})),
      [],
      `${colorScheme} accessibility`
    );
    // Check actual scrolling, not only matching fragment URLs.
    const sectionIds = [
      "skills",
      "education",
      "experience",
      "additional-projects",
      "achievements",
      "contact"
    ];
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({width, height: 844});
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth
        ),
        `overflow ${colorScheme} ${width}`
      );
      for (const id of sectionIds) {
        const menu = page.getByRole("button", {name: "Menu", exact: true});
        if (
          (await menu.isVisible()) &&
          (await menu.getAttribute("aria-expanded")) === "false"
        )
          await menu.click();
        const link = page.locator(`.navigation a[href="#${id}"]`);
        assert.equal(await link.count(), 1, `navbar target ${id}`);
        assert.equal(
          await link.evaluate(element => getComputedStyle(element).padding),
          "15px 20px"
        );
        assert.equal(
          await link.evaluate(element => getComputedStyle(element).color),
          colorScheme === "dark" ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"
        );
        await link.hover();
        assert.equal(
          await link.evaluate(
            element => getComputedStyle(element).backgroundColor
          ),
          colorScheme === "dark" ? "rgb(85, 25, 139)" : "rgb(244, 244, 244)"
        );
        await link.click();
        assert.equal(new URL(page.url()).hash, `#${id}`);
        await page.waitForFunction(target => {
          const rect = document.getElementById(target).getBoundingClientRect();
          const atEnd =
            Math.abs(
              scrollY + innerHeight - document.documentElement.scrollHeight
            ) < 2;
          return (
            (rect.top >= 0 && rect.top < 40) ||
            (atEnd && rect.top >= 0 && rect.top < innerHeight)
          );
        }, id);
        if (await menu.isVisible())
          assert.equal(await menu.getAttribute("aria-expanded"), "false");
      }
      await page.evaluate(() => window.scrollTo({top: 0, behavior: "instant"}));
      await page.locator(".button-greeting-div .main-button").click();
      assert.equal(new URL(page.url()).hash, "#contact");
      await page.waitForFunction(() => {
        const top = document
          .getElementById("contact")
          .getBoundingClientRect().top;
        return top >= 0 && top < innerHeight;
      });
    }
    assert.deepEqual(errors, [], "Hydration/console errors");
    await page.evaluate(() => localStorage.setItem("theme", "dark"));
    await page.reload();
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    results.push({
      colorScheme,
      axeViolations: axe.violations.length,
      hydrationErrors: 0,
      viewports: [320, 390, 768, 1440]
    });
    await page.close();
  }
  const nojs = await browser.newPage({
    javaScriptEnabled: false,
    viewport: {width: 390, height: 844}
  });
  await nojs.goto(url);
  assert.equal(await nojs.locator("html").getAttribute("data-theme"), "dark");
  for (const id of ["experience", "skills", "contact"])
    assert.ok(await nojs.locator(`#${id}`).isVisible());
  assert.ok(await nojs.getByRole("navigation", {name: "Primary"}).isVisible());
  await nojs.close();
  for (const mode of ["reduced-motion", "save-data"]) {
    const page = await browser.newPage({
      reducedMotion: mode === "reduced-motion" ? "reduce" : "no-preference"
    });
    if (mode === "save-data")
      await page.addInitScript(() =>
        Object.defineProperty(navigator, "connection", {
          value: {saveData: true}
        })
      );
    const requests = [];
    page.on("request", r => requests.push(r.url()));
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    assert.ok(
      !requests.some(request => /\/hero-[^/]+\.js/.test(request)),
      `${mode} loads no motion chunk`
    );
    await page.close();
  }
  const missing = await browser.newPage();
  const response = await missing.goto(`${url}/missing-page`);
  assert.equal(response.status(), 404);
  assert.equal(await missing.locator("h1").textContent(), "Page not found");
  const headers = (await fetch(url)).headers;
  assert.ok(headers.get("content-security-policy"));
  await mkdir("reports", {recursive: true});
  await writeFile(
    "reports/browser.json",
    JSON.stringify(
      {
        results,
        contrastFailures,
        noJS: true,
        reducedMotion: true,
        saveData: true,
        real404: true
      },
      null,
      2
    )
  );
  assert.deepEqual(
    contrastFailures,
    [],
    "Original palette contrast violations"
  );
  console.log(
    "Browser checks passed: light/dark axe, hydration, keyboard, 4 widths, no-JS, preferences, 404 and headers"
  );
} finally {
  await browser?.close();
  server.kill();
}
