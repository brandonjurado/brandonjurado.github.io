import {spawn} from "node:child_process";
import {mkdir, readFile, writeFile} from "node:fs/promises";
import assert from "node:assert/strict";
import {chromium} from "playwright";
import AxeBuilder from "@axe-core/playwright";
import {transformWithEsbuild} from "vite";
import {checkNotificationDemo} from "./notifications-browser.mjs";

const {code: consoleContentCode} = await transformWithEsbuild(
  await readFile("src/content/console-easter-egg.ts", "utf8"),
  "console-easter-egg.ts",
  {loader: "ts", format: "esm"}
);
const consoleContent = await import(
  `data:text/javascript;base64,${Buffer.from(consoleContentCode).toString("base64")}`
);

async function assertNoOverflow(page, label) {
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    ),
    `document overflow: ${label}`
  );
}

async function assertNavigationState(page, id) {
  await page.waitForURL(url => url.hash === `#${id}`);
  await assertNavigationSelection(page, id);
}

async function assertNavigationSelection(page, id) {
  const active = page.locator(`.navigation a[href="#${id}"]`);
  await page.waitForFunction(
    href =>
      document
        .querySelector(".navigation a[aria-current='location']")
        ?.getAttribute("href") === href,
    `#${id}`
  );
  assert.equal(
    await page.locator(".navigation a[aria-current='location']").count(),
    1
  );
  assert.equal(await active.getAttribute("role"), null);
}

async function assertNavigationThumb(page, id) {
  await page.waitForFunction(target => {
    const link = document.querySelector(`.navigation a[href="#${target}"]`);
    const thumb = document.querySelector(".navigation .rubber-segment__thumb");
    if (!link || !thumb) return false;
    const clip = getComputedStyle(thumb).clipPath.match(
      /^inset\(0(?:px)? ([\d.]+)px 0(?:px)? ([\d.]+)px/
    );
    if (!clip) return false;
    const itemRect = link.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    return (
      Math.abs(thumbRect.left + Number(clip[2]) - itemRect.left) < 1.5 &&
      Math.abs(thumbRect.right - Number(clip[1]) - itemRect.right) < 1.5
    );
  }, id);
}

async function observeNavigation(page) {
  await page.evaluate(() => {
    const nav = document.querySelector(".navigation");
    const thumb = nav.querySelector(".rubber-segment__thumb");
    const visibleWidth = () => {
      const clip = getComputedStyle(thumb).clipPath.match(
        /^inset\(0(?:px)? ([\d.]+)px 0(?:px)? ([\d.]+)px/
      );
      return (
        thumb.getBoundingClientRect().width - Number(clip[1]) - Number(clip[2])
      );
    };
    const observation = {
      selections: [],
      initialWidth: visibleWidth(),
      maxWidth: visibleWidth(),
      observer: new MutationObserver(() => {
        observation.selections.push(
          nav.querySelector("a[aria-current='location']").hash
        );
        observation.maxWidth = Math.max(observation.maxWidth, visibleWidth());
      })
    };
    observation.observer.observe(nav, {
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-current", "style"]
    });
    window.navigationObservation = observation;
  });
}

async function readNavigationObservation(page) {
  return page.evaluate(() => {
    const {observer, ...result} = window.navigationObservation;
    observer.disconnect();
    delete window.navigationObservation;
    return result;
  });
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
  const consoleLogs = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
    if (message.type() === "log")
      consoleLogs.push(
        Promise.all(message.args().map(argument => argument.jsonValue()))
      );
  });
  await page.addInitScript(() => {
    localStorage.setItem("theme", "light");
    Object.defineProperty(window, "requestIdleCallback", {
      value: undefined,
      configurable: true
    });
  });
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  for (const [width, height] of [
    [1024, 768],
    [1280, 720],
    [1440, 900]
  ]) {
    await page.setViewportSize({width, height});
    const proof = await page.locator(".overview-proof").boundingBox();
    assert.ok(
      proof.y >= 0 && proof.y + proof.height <= height,
      `${width}×${height}: employer proof fits in the first viewport`
    );
  }
  await page.setViewportSize({width: 390, height: 844});
  await page.locator(".navigation .rubber-segment[data-measured]").waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => typeof window.brandon?.help === "function");
  const greetingLine = consoleContent.GREETING.split("\n")[0];
  const greeting = `${consoleContent.ASCII_ART}\n\n${consoleContent.GREETING}`
    .replace(greetingLine, `%c${greetingLine}%c`)
    .replace(consoleContent.EMAIL, `%c${consoleContent.EMAIL}%c`);
  assert.deepEqual(await Promise.all(consoleLogs), [
    [
      greeting,
      consoleContent.GREETING_STYLE,
      "",
      consoleContent.EMAIL_STYLE,
      ""
    ]
  ]);
  const commandStart = consoleLogs.length;
  const api = await page.evaluate(() => {
    const descriptor = Object.getOwnPropertyDescriptor(window, "brandon");
    return {
      frozen: Object.isFrozen(window.brandon),
      plain: Object.getPrototypeOf(window.brandon) === Object.prototype,
      enumerable: descriptor.enumerable,
      writable: descriptor.writable,
      configurable: descriptor.configurable,
      methods: Object.keys(window.brandon),
      returnsUndefined: [
        window.brandon.help(),
        window.brandon.whoami(),
        window.brandon.stack()
      ].every(result => result === undefined)
    };
  });
  assert.deepEqual(api, {
    frozen: true,
    plain: true,
    enumerable: false,
    writable: false,
    configurable: false,
    methods: ["help", "whoami", "stack", "email"],
    returnsUndefined: true
  });
  assert.deepEqual(await Promise.all(consoleLogs.slice(commandStart)), [
    [consoleContent.HELP],
    [consoleContent.WHOAMI],
    [consoleContent.STACK]
  ]);
  const clipboardFailure = page.waitForEvent("console", {
    predicate: message =>
      message.type() === "log" &&
      message.text() === consoleContent.EMAIL_COPY_FAILED
  });
  assert.equal(
    await page.evaluate(() => {
      const descriptor = Object.getOwnPropertyDescriptor(
        navigator,
        "clipboard"
      );
      try {
        Object.defineProperty(navigator, "clipboard", {
          value: undefined,
          configurable: true
        });
        return window.brandon.email() === undefined;
      } finally {
        if (descriptor)
          Object.defineProperty(navigator, "clipboard", descriptor);
        else delete navigator.clipboard;
      }
    }),
    true
  );
  const fallbackLog = await clipboardFailure;
  assert.deepEqual(
    await Promise.all(fallbackLog.args().map(argument => argument.jsonValue())),
    [consoleContent.EMAIL_COPY_FAILED]
  );
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  assert.equal(await page.locator(".theme-toggle").count(), 0);
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(await page.locator("#notes").count(), 0);
  assert.deepEqual(await page.locator(".navigation a").allTextContents(), [
    "Overview",
    "Skills",
    "Systems",
    "Experience",
    "Contact"
  ]);
  await page.keyboard.press("Tab");
  assert.equal(await page.locator(":focus").textContent(), "Skip to content");
  await page.keyboard.press("Enter");
  await page.waitForURL(new URL("#main-content", url).href);
  assert.equal(new URL(page.url()).hash, "#main-content");

  await page.locator('.navigation a[href="#skills"]').focus();
  await page.keyboard.press("Enter");
  await assertNavigationState(page, "skills");
  for (const [key, id] of [
    ["ArrowRight", "systems"],
    ["ArrowLeft", "skills"],
    ["End", "contact"],
    ["Home", "greeting"]
  ]) {
    await page.keyboard.press(key);
    await assertNavigationState(page, id);
    assert.ok(
      await page
        .locator(`.navigation a[href="#${id}"]`)
        .evaluate(element => element === document.activeElement),
      `${key}: navigation focus follows selection`
    );
    await assertNavigationThumb(page, id);
  }
  await page.evaluate(() => {
    location.hash = "#experience";
  });
  await assertNavigationState(page, "experience");
  await assertNavigationThumb(page, "experience");
  await page.goBack();
  await assertNavigationState(page, "greeting");
  await assertNavigationThumb(page, "greeting");

  const dragFrom = await page
    .locator('.navigation a[href="#greeting"]')
    .boundingBox();
  const dragTo = await page
    .locator('.navigation a[href="#skills"]')
    .boundingBox();
  const startX = dragFrom.x + dragFrom.width / 2;
  const dragY = dragFrom.y + dragFrom.height / 2;
  await page.mouse.move(startX, dragY);
  await page.mouse.down();
  await page.mouse.move(startX + 10, dragY);
  await page.mouse.move(dragTo.x + dragTo.width / 2 + 10, dragY, {steps: 8});
  await page.waitForTimeout(120);
  await page.mouse.up();
  await assertNavigationState(page, "skills");
  await assertNavigationThumb(page, "skills");

  const results = [];
  const currentRole = page.locator("#experience details").first();
  await assertDisclosureState(page, currentRole, true, true);
  assert.ok(await currentRole.locator(".experience-text-desc").isVisible());
  await currentRole.locator("summary").focus();
  await page.keyboard.press("Enter");
  await assertDisclosureState(page, currentRole, false, true);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({width, height: 900});
    await assertNoOverflow(page, width);
    const contributions = await page
      .locator("#experience summary .career-trace__contribution")
      .all();
    assert.equal(contributions.length, 4);
    for (const contribution of contributions)
      assert.ok(
        await contribution.isVisible(),
        `${width}: visible contribution`
      );
    assert.equal(
      await page.locator(".request-trace__waterfall").isVisible(),
      width > 600,
      `${width}: mobile trace omits the waterfall`
    );
    const styles = await page.evaluate(() => {
      const heading = getComputedStyle(document.querySelector("h1"));
      return {
        font: heading.fontFamily,
        weight: heading.fontWeight,
        signatureFont: getComputedStyle(
          document.querySelector(".header-brand__signature")
        ).fontFamily
      };
    });
    assert.match(styles.font, /Inter/);
    assert.equal(styles.weight, "400");
    assert.match(styles.signatureFont, /Agustina Regular/);
    const hashBeforeScrolling = new URL(page.url()).hash;
    const scrollSections = [
      "greeting",
      "skills",
      "systems",
      "experience",
      "contact"
    ];
    for (const id of [...scrollSections, ...scrollSections.toReversed()]) {
      await page.evaluate(target => {
        const section = document.getElementById(target);
        const offset = parseFloat(
          getComputedStyle(document.documentElement).scrollPaddingTop
        );
        scrollTo({
          top: scrollY + section.getBoundingClientRect().top - offset,
          behavior: "instant"
        });
      }, id);
      await assertNavigationSelection(page, id);
      await assertNavigationThumb(page, id);
      assert.equal(new URL(page.url()).hash, hashBeforeScrolling);
    }
    await page.evaluate(() =>
      scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "instant"
      })
    );
    await assertNavigationSelection(page, "contact");
    await page.evaluate(() =>
      document.getElementById("education").scrollIntoView({behavior: "instant"})
    );
    await assertNavigationSelection(page, "experience");
    for (const id of [
      "greeting",
      "skills",
      "systems",
      "experience",
      "contact"
    ]) {
      await page.locator(`.navigation a[href="#${id}"]`).click();
      await assertNavigationState(page, id);
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
    const systemPanelHeight = await page
      .getByRole("tabpanel")
      .evaluate(panel => panel.getBoundingClientRect().height);
    const experienceTop = await page
      .locator("#experience")
      .evaluate(section => section.getBoundingClientRect().top + scrollY);
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
      assert.ok(
        Math.abs(
          (await panel.evaluate(
            element => element.getBoundingClientRect().height
          )) - systemPanelHeight
        ) < 1,
        `${width}, ${label}: stable panel height`
      );
      assert.ok(
        Math.abs(
          (await page
            .locator("#experience")
            .evaluate(
              section => section.getBoundingClientRect().top + scrollY
            )) - experienceTop
        ) < 1,
        `${width}, ${label}: following content stays in place`
      );
      assert.ok(
        Math.abs((await page.evaluate(() => scrollY)) - systemScrollY) < 2,
        `${width}, ${label}: keyboard tab changes preserve scroll position`
      );
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
    for (const label of [
      "Notifications",
      "Identity",
      "Billing",
      "Booking",
      representativeTab
    ]) {
      await page.getByRole("tab", {name: label, exact: true}).click();
      assert.ok(
        Math.abs(
          (await page
            .getByRole("tabpanel")
            .evaluate(panel => panel.getBoundingClientRect().height)) -
            systemPanelHeight
        ) < 1,
        `${width}, ${label}: click preserves panel height`
      );
      assert.ok(
        Math.abs((await page.evaluate(() => scrollY)) - systemScrollY) < 2,
        `${width}, ${label}: click preserves scroll position`
      );
    }

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
  await checkNotificationDemo(page);
  await checkAccessibility(page, "notification demo after delivery");
  const resume = await fetch(`${url}/resume.pdf`);
  assert.equal(resume.status, 404);
  assert.equal(await page.locator('a[href="/resume.pdf"]').count(), 0);
  assert.deepEqual(errors, [], "Hydration and console errors");
  assert.equal(
    (await Promise.all(consoleLogs)).filter(args => args[0] === greeting)
      .length,
    1,
    "console greeting remains one entry after navigation"
  );
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
    "achievements",
    "education",
    "contact"
  ])
    assert.ok(await nojs.locator(`#${id}`).isVisible());
  assert.equal(await nojs.locator("#off-the-clock").count(), 0);
  assert.ok(
    await nojs
      .getByRole("navigation", {name: "Primary", exact: true})
      .isVisible()
  );
  await nojs.locator('.navigation a[href="#systems"]').focus();
  await nojs.keyboard.press("Enter");
  await nojs.waitForURL(new URL("#systems", url).href);
  assert.equal(await nojs.getByRole("tabpanel").count(), 4);
  for (const panel of await nojs.getByRole("tabpanel").all())
    assert.ok(await panel.isVisible());
  assert.equal(await nojs.getByRole("tablist").isVisible(), false);
  const nojsCareer = nojs.locator("#experience details").first();
  await assertDisclosureState(nojs, nojsCareer, true);
  assert.ok(await nojsCareer.locator(".experience-text-desc").isVisible());
  await nojsCareer.locator("summary").focus();
  await nojs.keyboard.press("Enter");
  await assertDisclosureState(nojs, nojsCareer, false);
  await nojs.keyboard.press("Space");
  await assertDisclosureState(nojs, nojsCareer, true);
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
    motion.on("pageerror", error => errors.push(error.message));
    motion.on("console", message => {
      if (message.type() === "error") errors.push(message.text());
    });
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
      for (const width of [1440, 390]) {
        await motion.setViewportSize({width, height: 900});
        await motion.goto(url);
        await motion.reload();
        await motion.waitForFunction(
          () =>
            document.getElementById("systems")?.dataset.sectionReveal ===
            "pending"
        );
        const sectionStates = await motion
          .locator("#main-content section[id], #contact")
          .evaluateAll(sections =>
            sections.map(section => ({
              id: section.id,
              state: section.dataset.sectionReveal,
              top: section.getBoundingClientRect().top,
              bottom: section.getBoundingClientRect().bottom
            }))
          );
        assert.equal(sectionStates.length, 7);
        for (const section of sectionStates) {
          assert.ok(
            section.state === "pending" ||
              section.state === "revealed" ||
              (section.top < 900 && section.bottom > 0),
            `${width}, ${section.id}: offscreen content has reveal state; visible content stays readable`
          );
        }
        const systems = motion.locator("#systems");
        const systemGeometry = await systems.evaluate(section => ({
          top: section.getBoundingClientRect().top + scrollY,
          height: section.getBoundingClientRect().height
        }));
        assert.equal(
          await systems.evaluate(
            section => getComputedStyle(section.firstElementChild).opacity
          ),
          "0",
          `${width}: unvisited section waits for viewport entry`
        );
        await motion.evaluate(() =>
          document.getElementById("systems").scrollIntoView({
            behavior: "instant",
            block: "start"
          })
        );
        await motion.waitForFunction(() => {
          const section = document.getElementById("systems");
          const opacity = Number(
            getComputedStyle(section.firstElementChild).opacity
          );
          return (
            section.dataset.sectionReveal === "revealed" &&
            opacity > 0 &&
            opacity < 1 &&
            section
              .getAnimations({subtree: true})
              .some(animation => animation.id === "section-reveal")
          );
        });
        assert.deepEqual(
          await systems.evaluate(section => ({
            top: section.getBoundingClientRect().top + scrollY,
            height: section.getBoundingClientRect().height
          })),
          systemGeometry,
          `${width}: reveal preserves section geometry`
        );
        await systems.evaluate(section =>
          Promise.all(
            section
              .getAnimations({subtree: true})
              .filter(animation => animation.id === "section-reveal")
              .map(animation => animation.finished)
          )
        );
        assert.ok(
          await systems.evaluate(section =>
            [...section.children].every(
              child =>
                getComputedStyle(child).opacity === "1" &&
                getComputedStyle(child).transform === "none"
            )
          ),
          `${width}: section finishes fully visible`
        );
        await motion.evaluate(() => scrollTo({top: 0, behavior: "instant"}));
        await motion.waitForFunction(
          () =>
            document.getElementById("systems").getBoundingClientRect().top >=
            innerHeight
        );
        await motion.evaluate(() =>
          document
            .getElementById("systems")
            .scrollIntoView({behavior: "instant"})
        );
        await motion.waitForFunction(
          () =>
            document.getElementById("systems").getBoundingClientRect().top <
            innerHeight
        );
        await motion.evaluate(
          () =>
            new Promise(resolve =>
              requestAnimationFrame(() => requestAnimationFrame(resolve))
            )
        );
        assert.equal(
          await systems.evaluate(
            section =>
              section
                .getAnimations({subtree: true})
                .filter(animation => animation.id === "section-reveal").length
          ),
          0,
          `${width}: revisiting a section does not replay its reveal`
        );
        assert.equal(
          await motion.locator("#contact").getAttribute("data-section-reveal"),
          "pending"
        );
        await motion
          .locator(".contact-email-action")
          .evaluate(action => action.focus({preventScroll: true}));
        assert.ok(
          await motion
            .locator("#contact")
            .evaluate(
              section =>
                getComputedStyle(section.firstElementChild).opacity === "1" &&
                !section
                  .getAnimations({subtree: true})
                  .some(animation => animation.id === "section-reveal")
            ),
          `${width}: focused contact action reveals immediately`
        );
        await motion.evaluate(() => {
          document.activeElement.blur();
          scrollTo({top: 0, behavior: "instant"});
        });
        // Start navigation sampling without a prior scroll-driven spring still settling.
        await motion.reload();
        await motion.waitForFunction(
          () =>
            document.querySelector(".request-trace")?.dataset.motion ===
            "running"
        );
        await assertNavigationSelection(motion, "greeting");
        await assertNavigationThumb(motion, "greeting");
        await observeNavigation(motion);
        await motion.locator('.navigation a[href="#contact"]').click();
        await motion.waitForFunction(() => {
          const page = document.documentElement;
          const offset = parseFloat(getComputedStyle(page).scrollPaddingTop);
          const top = document
            .getElementById("contact")
            .getBoundingClientRect().top;
          return (
            Math.abs(top - offset) <= 1 ||
            scrollY + innerHeight >= page.scrollHeight - 1
          );
        });
        await assertNavigationThumb(motion, "contact");
        const clickObservation = await readNavigationObservation(motion);
        assert.ok(clickObservation.selections.length > 0);
        assert.ok(
          clickObservation.selections.every(value => value === "#contact"),
          `${width}: smooth scrolling preserves clicked selection`
        );
        assert.ok(
          clickObservation.maxWidth > clickObservation.initialWidth + 20,
          `${width}: click keeps elastic stretch`
        );

        await observeNavigation(motion);
        await motion.mouse.move(width / 2, 450);
        await motion.mouse.wheel(0, -10000);
        await assertNavigationSelection(motion, "greeting");
        await assertNavigationThumb(motion, "greeting");
        const scrollObservation = await readNavigationObservation(motion);
        assert.ok(
          scrollObservation.maxWidth > scrollObservation.initialWidth + 20,
          `${width}: manual scrolling keeps elastic stretch`
        );

        await motion.locator('.navigation a[href="#contact"]').click();
        await motion.waitForFunction(() => scrollY > 300);
        await motion.locator(":focus").evaluate(element => element.blur());
        await motion.keyboard.press("Home");
        await assertNavigationSelection(motion, "greeting");
        await assertNavigationThumb(motion, "greeting");
        if (process.env.CAPTURE_SCREENSHOTS === "1") {
          await mkdir("reports", {recursive: true});
          await motion.evaluate(() => document.fonts.ready);
          await motion.evaluate(() => scrollTo({top: 0, behavior: "instant"}));
          await motion.screenshot({
            path: `reports/background-${width === 1440 ? "desktop" : "mobile"}-${width}.jpg`,
            type: "jpeg",
            quality: 90
          });
        }
        await motion.locator(".request-trace").scrollIntoViewIfNeeded();
        await motion.waitForFunction(
          () =>
            document.querySelector(".request-trace")?.dataset.motion ===
            "running"
        );
        if (process.env.CAPTURE_SCREENSHOTS === "1") {
          await mkdir("reports", {recursive: true});
          await motion.evaluate(() => document.fonts.ready);
          await motion.screenshot({
            path: `reports/after-${width === 1440 ? "desktop" : "mobile"}-${width}.jpg`,
            type: "jpeg",
            quality: 90,
            fullPage: true
          });
          for (const [name, selector] of [
            ["header", ".header"],
            ["navigation", ".navigation"],
            ["footer", ".footer-shell"]
          ])
            await motion.locator(selector).screenshot({
              path: `reports/${name}-${width}.jpg`,
              type: "jpeg",
              quality: 90
            });
          await motion.locator(".request-trace").scrollIntoViewIfNeeded();
          await motion.waitForFunction(
            () =>
              document.querySelector(".request-trace")?.dataset.motion ===
              "running"
          );
        }
        const pathError = await motion.evaluate(() => {
          const graph = [
            ...document.querySelectorAll(".request-trace__connections")
          ].find(element => getComputedStyle(element).display !== "none");
          graph.pauseAnimations();
          const route = graph.querySelector(".request-trace__route");
          const packet = graph.querySelector(".request-trace__packet");
          const animation = packet.querySelector("animateMotion");
          const start = animation.getStartTime();
          const error = Math.max(
            ...[0.1, 0.45, 0.5, 0.55, 0.9].map(progress => {
              graph.setCurrentTime(start + progress * 6);
              const expected = route
                .getPointAtLength(route.getTotalLength() * progress)
                .matrixTransform(route.getScreenCTM());
              const actual = new DOMPoint(0, 0).matrixTransform(
                packet.getScreenCTM()
              );
              return Math.hypot(expected.x - actual.x, expected.y - actual.y);
            })
          );
          graph.unpauseAnimations();
          return error;
        });
        assert.ok(
          pathError < 0.1,
          `${width}: packet follows SVG path (${pathError}px)`
        );
      }
      assert.equal(
        await motion
          .locator(".request-trace__connections--compact")
          .evaluate(graph => graph.animationsPaused()),
        false
      );
      await motion.locator("#contact").scrollIntoViewIfNeeded();
      await motion.waitForFunction(
        () =>
          document.querySelector(".request-trace")?.dataset.motion === "paused"
      );
      assert.ok(
        await motion
          .locator(".request-trace__connections--compact")
          .evaluate(graph => graph.animationsPaused())
      );
      await motion.locator(".header").scrollIntoViewIfNeeded();
      await motion.waitForFunction(
        () => document.querySelector(".header")?.dataset.motion === "running"
      );
      assert.equal(
        await motion
          .locator(".status-dot")
          .evaluate(dot => getComputedStyle(dot, "::after").animationPlayState),
        "running"
      );
      await motion.goto(`${url}/#contact`);
      await motion.reload();
      await motion.waitForFunction(
        () =>
          document.getElementById("contact")?.dataset.sectionReveal ===
          "revealed"
      );
      await motion.locator("#contact").evaluate(section =>
        Promise.all(
          section
            .getAnimations({subtree: true})
            .filter(animation => animation.id === "section-reveal")
            .map(animation => animation.finished)
        )
      );
      assert.equal(
        await motion
          .locator("#contact")
          .evaluate(
            section => getComputedStyle(section.firstElementChild).opacity
          ),
        "1",
        "direct contact hash reveals its content"
      );
      await motion.goto(url);
      await motion.reload();
      await motion.waitForFunction(
        () =>
          document.getElementById("systems")?.dataset.sectionReveal ===
          "pending"
      );
      await motion.evaluate(() =>
        document.getElementById("systems").scrollIntoView({behavior: "instant"})
      );
      await motion.waitForFunction(() => {
        const section = document.getElementById("systems");
        const opacity = Number(
          getComputedStyle(section.firstElementChild).opacity
        );
        return (
          opacity > 0 &&
          opacity < 1 &&
          section
            .getAnimations({subtree: true})
            .some(
              animation =>
                animation.id === "section-reveal" &&
                animation.playState === "running"
            )
        );
      });
      await motion.emulateMedia({reducedMotion: "reduce"});
      await motion.waitForFunction(
        () => document.querySelectorAll("[data-section-reveal]").length === 0
      );
      assert.equal(
        await motion.evaluate(
          () =>
            document
              .getAnimations()
              .filter(animation => animation.id === "section-reveal").length
        ),
        0,
        "runtime reduced-motion preference cancels section reveals"
      );
      assert.ok(
        await motion.evaluate(() =>
          [...document.querySelectorAll("main section[id], #contact")].every(
            section =>
              [...section.children].every(
                child => getComputedStyle(child).opacity === "1"
              )
          )
        ),
        "runtime reduced-motion preference reveals all pending and animating content"
      );
    } else {
      assert.equal(await motion.locator("[data-section-reveal]").count(), 0);
      assert.ok(
        await motion.evaluate(
          () =>
            [...document.querySelectorAll("main section[id], #contact")].every(
              section =>
                [...section.children].every(
                  child => getComputedStyle(child).opacity === "1"
                )
            ) &&
            !document
              .getAnimations()
              .some(animation => animation.id === "section-reveal")
        ),
        `${preference}: all section content stays visible without reveals`
      );
      assert.equal(
        await motion
          .locator(".request-trace__packet")
          .first()
          .evaluate(el => getComputedStyle(el).display),
        "none"
      );
      assert.equal(
        await motion
          .locator(".status-dot")
          .evaluate(dot => getComputedStyle(dot, "::after").animationName),
        "none"
      );
    }
    await motion.close();
  }
  assert.deepEqual(errors, [], "Hydration and motion console errors");

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
        stableSystemPanels: true,
        rubberNavigation: true,
        navigationHashSync: true,
        navigationScrollSync: true,
        elasticScrollNavigation: true,
        navigationClickScrollIsolation: true,
        navigationDrag: true,
        reducedMotionNavigation: true,
        productionConsoleGreeting: true,
        consoleApi: true,
        consoleClipboardFallback: true,
        consoleIdleFallback: true,
        nativeCareerDisclosures: true,
        nativeMoreBuilds: true,
        staticPreferences: true,
        offscreenPause: true,
        exactRequestPath: true,
        statusGlow: true,
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
