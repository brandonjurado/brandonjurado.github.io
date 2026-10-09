import assert from "node:assert/strict";
import {mkdir} from "node:fs/promises";

async function demoDiagnostics(page) {
  return page.evaluate(() => {
    const demo = document.querySelector(".notification-demo");
    const slider = demo?.querySelector("[role=slider]");
    const bounds = element => {
      if (!element) return null;
      const {x, y, width, height} = element.getBoundingClientRect();
      return {x, y, width, height};
    };
    return {
      phase: demo?.dataset.phase,
      order: demo?.dataset.orderId,
      attempt: demo?.dataset.deliveryAttempt,
      slider: slider
        ? Object.fromEntries(
            [
              "aria-disabled",
              "aria-busy",
              "aria-valuenow",
              "aria-valuetext",
              "tabindex"
            ].map(attribute => [attribute, slider.getAttribute(attribute)])
          )
        : null,
      sliderPhase: slider?.closest(".slide-commit")?.dataset.phase,
      demoBounds: bounds(demo),
      sliderBounds: bounds(slider),
      scrollY,
      viewport: {width: innerWidth, height: innerHeight},
      documentHidden: document.hidden,
      focused: document.activeElement?.outerHTML.slice(0, 300),
      selectedTab: document.querySelector('[role=tab][aria-selected="true"]')
        ?.textContent,
      observedPhases: window.notificationDemoObservation?.phases
    };
  });
}

async function waitForPhase(page, phase) {
  try {
    await page.waitForFunction(
      expected =>
        document.querySelector(".notification-demo")?.dataset.phase ===
        expected,
      phase,
      {timeout: 10000}
    );
  } catch (cause) {
    throw new Error(
      `Notification phase ${phase} timed out: ${JSON.stringify(await demoDiagnostics(page))}`,
      {cause}
    );
  }
}

async function prepareSlider(page, slider) {
  await slider.scrollIntoViewIfNeeded();
  // Give viewport and scroll observers their next frames before checking readiness.
  await page.evaluate(
    () =>
      new Promise(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      )
  );
  try {
    await page.waitForFunction(() => {
      const slider = document.querySelector(".notification-demo [role=slider]");
      if (!slider || slider.getAttribute("aria-disabled") === "true")
        return false;
      const bounds = slider.getBoundingClientRect();
      return bounds.top >= 0 && bounds.bottom <= innerHeight;
    });
  } catch (cause) {
    throw new Error(
      `Notification slider did not become ready: ${JSON.stringify(await demoDiagnostics(page))}`,
      {cause}
    );
  }
}

async function observeDemo(page) {
  await page.evaluate(() => {
    const phases = [];
    const orders = new Set();
    const toasts = new Set();
    const record = () => {
      const demo = document.querySelector(".notification-demo");
      if (demo && phases.at(-1) !== demo.dataset.phase)
        phases.push(demo.dataset.phase);
      if (demo?.dataset.orderId) orders.add(demo.dataset.orderId);
      document
        .querySelectorAll(".swipe-toast")
        .forEach(toast => toasts.add(toast));
    };
    const observer = new MutationObserver(record);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-phase", "data-order-id"]
    });
    record();
    window.notificationDemoObservation = {observer, phases, orders, toasts};
  });
}

async function readObservation(page) {
  return page.evaluate(() => {
    const {observer, phases, orders, toasts} =
      window.notificationDemoObservation;
    observer.disconnect();
    delete window.notificationDemoObservation;
    return {phases, orders: [...orders], confirmations: toasts.size};
  });
}

async function dragSlider(page, fraction = 1, ensureVisible = true) {
  const track = page.locator(".notification-demo .slide-commit__track");
  if (ensureVisible) await track.scrollIntoViewIfNeeded();
  const bounds = await track.boundingBox();
  assert.ok(bounds, "order slider has measurable bounds");
  const start = bounds.x + bounds.height / 2;
  const travel = bounds.width - bounds.height;
  const y = bounds.y + bounds.height / 2;
  await page.mouse.move(start, y);
  await page.mouse.down();
  await page.mouse.move(
    start + travel * fraction + (fraction === 1 ? 2 : 0),
    y,
    {
      steps: 12
    }
  );
}

async function assertNoOverflow(page, label) {
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    ),
    `notification demo overflow: ${label}`
  );
}

async function assertOrderRow(page, label, showProgress) {
  const demo = page.locator(".notification-demo");
  const thought = demo.locator(".thought-line");
  const layout = await demo.evaluate(element => {
    const bounds = node => {
      if (!node) return null;
      const {x, y, width, height} = node.getBoundingClientRect();
      return {x, y, width, height};
    };
    const hint = element.querySelector(".notification-demo-place > p");
    return {
      track: bounds(element.querySelector(".slide-commit__track")),
      scenarios: bounds(element.querySelector(".notification-demo-scenarios")),
      hint: bounds(hint),
      hintAlign: hint && getComputedStyle(hint).textAlign,
      controls: bounds(element.querySelector(".notification-demo-controls")),
      flow: bounds(element.querySelector(".notification-demo-flow")),
      progress: bounds(element.querySelector(".notification-demo-progress")),
      stages: [...element.querySelectorAll("[data-stage-index]")].map(bounds),
      mobile: innerWidth <= 600
    };
  });
  const {track, scenarios, hint, controls, flow, progress} = layout;
  assert.ok(
    track && scenarios && hint && controls && flow,
    `${label}: notification controls and graph have bounds`
  );
  assert.equal(
    layout.hintAlign,
    "center",
    `${label}: drag hint text is centered`
  );
  assert.ok(
    Math.abs(hint.x + hint.width / 2 - (track.x + track.width / 2)) < 1,
    `${label}: hint is centered beneath the slider`
  );
  assert.ok(
    track.x >= scenarios.x + scenarios.width - 1,
    `${label}: slider is to the right of delivery choices`
  );
  assert.ok(
    Math.min(scenarios.y + scenarios.height, track.y + track.height) >
      Math.max(scenarios.y, track.y),
    `${label}: delivery choices and slider share a row`
  );
  assert.ok(
    controls.height <= (layout.mobile ? 150 : 110),
    `${label}: compact controls height (${controls.height}px)`
  );
  const graphGap = flow.y - (controls.y + controls.height);
  assert.ok(
    graphGap >= -1 && graphGap <= 16,
    `${label}: compact controls-to-graph gap (${graphGap}px)`
  );
  if (layout.mobile) {
    const [order, routing, queued, messaging] = layout.stages;
    assert.equal(layout.stages.length, 4, `${label}: four notification stages`);
    assert.ok(
      Math.abs(order.y - routing.y) < 1 &&
        Math.abs(queued.y - messaging.y) < 1 &&
        queued.y >=
          Math.max(order.y + order.height, routing.y + routing.height),
      `${label}: mobile notification stages occupy two rows`
    );
    assert.ok(
      order.x < routing.x && messaging.x < queued.x,
      `${label}: mobile notification stages follow the snake order`
    );
  }
  if (!showProgress) {
    assert.equal(await thought.count(), 0, `${label}: idle hides progress`);
    return;
  }
  assert.ok(await thought.isVisible(), `${label}: order progress is visible`);
  assert.ok(progress, `${label}: order progress has bounds`);
  assert.ok(
    progress.y >= scenarios.y + scenarios.height - 1,
    `${label}: progress is beneath delivery choices`
  );
  assert.ok(
    progress.x + progress.width <= track.x + 1,
    `${label}: progress stays in the left column`
  );
}

/** Run once against an already loaded portfolio page. */
export async function checkNotificationDemo(page) {
  const viewport = page.viewportSize();
  const reducedMotion = await page.evaluate(() =>
    matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "reduce"
      : "no-preference"
  );
  const notifications = page.getByRole("tab", {
    name: "Notifications",
    exact: true
  });
  const demo = page.locator(".notification-demo");
  const slider = demo.getByRole("slider", {name: "Slide to place order"});
  const reset = demo.getByRole("button", {name: "Reset example"});
  const direct = demo.getByRole("radio", {name: "Direct delivery"});
  const retry = demo.getByRole("radio", {name: "Retry once"});
  const stages = page.locator("#system-panel-notifications [data-stage-index]");
  const toast = page.locator(".swipe-toast");
  const confirmation = toast.getByRole("status");

  try {
    await page.setViewportSize({width: 1440, height: 900});
    await page.emulateMedia({reducedMotion: "no-preference"});
    await page.locator('.navigation a[href="#systems"]').click();
    await page.waitForFunction(() => {
      const root = document.documentElement;
      const offset = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
      const top = document
        .getElementById("systems")
        .getBoundingClientRect().top;
      return (
        Math.abs(top - offset) <= 1 ||
        scrollY + innerHeight >= root.scrollHeight - 1
      );
    });
    await notifications.click();
    await demo.waitFor({state: "visible"});
    await slider.waitFor({state: "visible"});
    if (await reset.isEnabled()) await reset.click();
    await waitForPhase(page, "idle");
    await direct.check();
    await assertOrderRow(page, "1440, idle", false);
    assert.equal(await demo.getAttribute("data-order-id"), "");
    assert.equal(await slider.getAttribute("aria-valuenow"), "0");
    assert.equal(await stages.count(), 4);
    assert.deepEqual(
      await stages.evaluateAll(nodes =>
        nodes.map(node => node.dataset.nodeState)
      ),
      ["waiting", "waiting", "waiting", "waiting"]
    );

    // Releasing a partial gesture, or cancelling one, must not place an order.
    await dragSlider(page, 0.35);
    await page.mouse.up();
    await page.waitForFunction(
      () =>
        document
          .querySelector(".notification-demo [role=slider]")
          ?.getAttribute("aria-valuenow") === "0"
    );
    assert.equal(await demo.getAttribute("data-phase"), "idle");
    assert.equal(await demo.getAttribute("data-order-id"), "");
    await dragSlider(page, 0.6);
    await page.keyboard.press("Escape");
    await page.mouse.up();
    await page.waitForFunction(
      () =>
        document
          .querySelector(".notification-demo [role=slider]")
          ?.getAttribute("aria-valuenow") === "0"
    );
    assert.equal(await demo.getAttribute("data-phase"), "idle");
    assert.equal(await demo.getAttribute("data-order-id"), "");
    assert.equal(await toast.count(), 0);

    // The first order is keyboard-confirmed, and repeated input stays locked.
    await observeDemo(page);
    await slider.focus();
    await page.keyboard.press("Enter");
    await waitForPhase(page, "processing");
    await assertOrderRow(page, "1440, processing", true);
    const directOrder = await demo.getAttribute("data-order-id");
    assert.ok(directOrder, "confirmed order exposes an event identifier");
    assert.equal(await slider.getAttribute("aria-disabled"), "true");
    assert.ok(await direct.isDisabled());
    assert.ok(await retry.isDisabled());
    assert.equal(await stages.nth(0).getAttribute("data-node-state"), "active");
    const pendingScrollY = await page.evaluate(() => scrollY);
    await page.keyboard.press("Enter");
    await page.keyboard.press("End");
    await page.evaluate(
      () =>
        new Promise(resolve =>
          requestAnimationFrame(() => requestAnimationFrame(resolve))
        )
    );
    assert.ok(
      Math.abs((await page.evaluate(() => scrollY)) - pendingScrollY) < 1,
      "locked slider keys preserve scroll position"
    );
    await dragSlider(page, 1, false);
    await page.mouse.up();
    assert.equal(await demo.getAttribute("data-order-id"), directOrder);
    await waitForPhase(page, "delivered");
    await assertOrderRow(page, "1440, delivered", true);
    await confirmation.waitFor({state: "visible"});
    assert.match(await confirmation.textContent(), /Order confirmed/);
    assert.equal(await confirmation.getByRole("button").count(), 0);
    assert.ok(
      !(await toast.evaluate(element =>
        element.contains(document.activeElement)
      )),
      "confirmation does not steal keyboard focus"
    );
    assert.deepEqual(
      await stages.evaluateAll(nodes =>
        nodes.map(node => node.dataset.nodeState)
      ),
      ["complete", "complete", "complete", "complete"]
    );
    assert.equal(await demo.getAttribute("data-delivery-attempt"), "1");
    const directTrace = await readObservation(page);
    assert.deepEqual(directTrace.phases, [
      "idle",
      "processing",
      "routing",
      "queued",
      "sending",
      "delivered"
    ]);
    assert.deepEqual(directTrace.orders, [directOrder]);
    assert.equal(
      directTrace.confirmations,
      1,
      "repeated gestures confirm one order"
    );
    await mkdir("reports", {recursive: true});
    await toast.locator(".swipe-toast__card").click({trial: true});
    await demo.screenshot({
      path: "reports/notifications-desktop-demo.jpg",
      type: "jpeg",
      quality: 90
    });
    await toast.getByRole("button", {name: "Dismiss notification"}).focus();
    await page.keyboard.press("Enter");
    await toast.waitFor({state: "detached"});
    assert.equal(await demo.getAttribute("data-phase"), "delivered");

    // A drag starts the retry path; the second attempt retains its order ID.
    await reset.click();
    await waitForPhase(page, "idle");
    await assertOrderRow(page, "1440, reset", false);
    await retry.check();
    await observeDemo(page);
    await dragSlider(page);
    await page.mouse.up();
    await waitForPhase(page, "processing");
    const retryOrder = await demo.getAttribute("data-order-id");
    await waitForPhase(page, "retrying");
    assert.equal(await demo.getAttribute("data-order-id"), retryOrder);
    assert.equal(await demo.getAttribute("data-delivery-attempt"), "1");
    assert.equal(
      await stages.nth(3).getAttribute("data-node-state"),
      "retrying"
    );
    assert.equal(await toast.count(), 0, "retry has no premature confirmation");
    await waitForPhase(page, "delivered");
    assert.equal(await demo.getAttribute("data-order-id"), retryOrder);
    assert.equal(await demo.getAttribute("data-delivery-attempt"), "2");
    await confirmation.waitFor({state: "visible"});
    const retryTrace = await readObservation(page);
    assert.deepEqual(retryTrace.orders, [retryOrder]);
    assert.equal(
      retryTrace.confirmations,
      1,
      "retry delivers one confirmation"
    );
    assert.deepEqual(retryTrace.phases, [
      "idle",
      "processing",
      "routing",
      "queued",
      "sending",
      "retrying",
      "sending",
      "delivered"
    ]);
    const card = toast.locator(".swipe-toast__card");
    await card.click({trial: true});
    const toastBounds = await card.boundingBox();
    assert.ok(toastBounds, "confirmation toast can be swiped");
    const toastX = toastBounds.x + toastBounds.width / 2;
    const toastY = toastBounds.y + 20;
    await page.mouse.move(toastX, toastY);
    await page.mouse.down();
    await page.mouse.move(toastX, toastY + 80, {steps: 12});
    await page.mouse.up();
    await toast.waitFor({state: "detached"});

    // Cancel two in-flight runs, then watch beyond either delivery deadline.
    await reset.click();
    await observeDemo(page);
    await slider.focus();
    await page.keyboard.press("End");
    await waitForPhase(page, "queued");
    await reset.click();
    await waitForPhase(page, "idle");
    assert.equal(await demo.getAttribute("data-order-id"), "");
    await slider.focus();
    await page.keyboard.press("End");
    await waitForPhase(page, "queued");
    await page.getByRole("tab", {name: "Identity", exact: true}).click();
    await notifications.click();
    await waitForPhase(page, "idle");
    await page.waitForTimeout(6500);
    assert.equal(await demo.getAttribute("data-phase"), "idle");
    assert.equal(await demo.getAttribute("data-order-id"), "");
    assert.equal(await demo.getAttribute("data-delivery-attempt"), "0");
    assert.equal(await toast.count(), 0);
    assert.equal(
      (await readObservation(page)).confirmations,
      0,
      "Reset and tab changes cancel delivery without a late toast"
    );

    // Reduced motion preserves the state feedback on small screens.
    await page.emulateMedia({reducedMotion: "reduce"});
    for (const width of [320, 390]) {
      await page.setViewportSize({width, height: 844});
      await prepareSlider(page, slider);
      await assertNoOverflow(page, `${width}, idle`);
      assert.ok(await slider.isVisible());
      await assertOrderRow(page, `${width}, idle`, false);
      if (width === 320) {
        await slider.focus();
        await page.keyboard.press("Enter");
        await waitForPhase(page, "processing");
        await assertOrderRow(page, "320, processing", true);
        await assertNoOverflow(page, "320, processing");
        await reset.click();
        await waitForPhase(page, "idle");
        await assertOrderRow(page, "320, reset", false);
      }
    }
    await direct.check();
    await prepareSlider(page, slider);
    await slider.focus();
    await page.keyboard.press("End");
    await waitForPhase(page, "processing");
    await assertOrderRow(page, "390, processing", true);
    await waitForPhase(page, "sending");
    await assertNoOverflow(page, "390, sending, reduced motion");
    assert.equal(await stages.nth(3).getAttribute("data-node-state"), "active");
    assert.ok(
      await demo
        .locator(".notification-flow-packet")
        .evaluateAll(packets =>
          packets.every(
            packet => getComputedStyle(packet).animationName === "none"
          )
        ),
      "reduced motion keeps stage feedback without moving packets"
    );
    await waitForPhase(page, "delivered");
    await assertOrderRow(page, "390, delivered", true);
    await confirmation.waitFor({state: "visible"});
    assert.match(await confirmation.textContent(), /Order confirmed/);
    await assertNoOverflow(page, "390, delivered, reduced motion");
    await toast.locator(".swipe-toast__card").click({trial: true});
    const confirmationBounds = await toast.boundingBox();
    const navigationBounds = await page.locator(".navigation").boundingBox();
    assert.ok(
      confirmationBounds &&
        navigationBounds &&
        confirmationBounds.y + confirmationBounds.height < navigationBounds.y,
      "mobile confirmation stays above navigation"
    );
    await demo.screenshot({
      path: "reports/notifications-mobile-demo.jpg",
      type: "jpeg",
      quality: 90
    });
    await page.screenshot({
      path: "reports/notifications-mobile-toast.jpg",
      type: "jpeg",
      quality: 90
    });

    // Reading a focused toast pauses expiry; leaving it resumes its lifetime.
    await toast.getByRole("button", {name: "Dismiss notification"}).focus();
    await page.mouse.move(1, 1);
    await page.waitForTimeout(6800);
    assert.ok(
      await confirmation.isVisible(),
      "contained focus pauses toast expiry"
    );
    await reset.focus();
    await toast.waitFor({state: "detached", timeout: 7500});
    assert.equal(await demo.getAttribute("data-phase"), "delivered");
  } finally {
    await page.evaluate(() => {
      window.notificationDemoObservation?.observer.disconnect();
      delete window.notificationDemoObservation;
    });
    await page.emulateMedia({reducedMotion});
    if (viewport) await page.setViewportSize(viewport);
  }
}
