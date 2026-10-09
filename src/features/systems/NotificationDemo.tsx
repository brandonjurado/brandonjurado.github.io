import {useCallback, useEffect, useRef, useState} from "react";
import SlideCommit from "../../components/reactBits/SlideCommit";
import SwipeToast from "../../components/reactBits/SwipeToast";
import ThoughtLine from "../../components/reactBits/ThoughtLine";
import NotificationsFlow, {
  notificationDecision,
  type NotificationPhase
} from "./NotificationsFlow";

const progressCopy: Record<NotificationPhase, string> = {
  idle: "Ready when you are",
  processing: "Processing order",
  routing: "Choosing channels",
  queued: "Confirmation queued",
  sending: "Sending message",
  retrying: "Retrying delivery",
  delivered: "Message delivered"
};

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      reject(new DOMException("Example reset", "AbortError"));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    }, ms);
    signal.addEventListener("abort", abort, {once: true});
    if (signal.aborted) abort();
  });
}

export default function NotificationDemo({active}: {active: boolean}) {
  const [phase, setPhase] = useState<NotificationPhase>("idle");
  const [retry, setRetry] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [run, setRun] = useState(0);
  const [width, setWidth] = useState(280);
  const control = useRef<HTMLDivElement>(null);
  const example = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);
  const nextOrder = useRef(1042);
  const running = phase !== "idle" && phase !== "delivered";

  const reset = useCallback(() => {
    controller.current?.abort();
    controller.current = null;
    setPhase("idle");
    setAttempt(0);
    setOrderId("");
    setToastOpen(false);
    setRun(previous => previous + 1);
  }, []);

  useEffect(() => {
    const target = control.current;
    if (!target) return;
    const resize = () => setWidth(Math.min(280, target.clientWidth));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) reset();
  }, [active, reset]);

  useEffect(() => {
    const onHidden = () => {
      if (document.hidden && controller.current) reset();
    };
    const observer = new IntersectionObserver(entries => {
      const inView = entries[0].isIntersecting;
      setVisible(inView);
      if (!inView && controller.current) reset();
    });
    if (example.current) observer.observe(example.current);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      controller.current?.abort();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [reset]);

  async function placeOrder() {
    if (controller.current) return;
    if (!active || !visible || document.hidden)
      throw new DOMException("Example is outside the viewport", "AbortError");
    const transaction = new AbortController();
    controller.current = transaction;
    const {signal} = transaction;
    setToastOpen(false);
    setOrderId(`order.${nextOrder.current++}`);
    setAttempt(0);
    setPhase("processing");
    try {
      await wait(700, signal);
      setPhase("routing");
      await wait(850, signal);
      setPhase("queued");
      await wait(650, signal);
      setPhase("sending");
      setAttempt(1);
      await wait(1000, signal);
      if (retry) {
        setPhase("retrying");
        await wait(1400, signal);
        setPhase("sending");
        setAttempt(2);
        await wait(900, signal);
      }
      setPhase("delivered");
      setToastOpen(true);
    } finally {
      if (controller.current === transaction) controller.current = null;
    }
  }

  return (
    <div
      className="notification-demo"
      ref={example}
      data-phase={phase}
      data-order-id={orderId}
      data-delivery-attempt={attempt}
    >
      <div className="notification-demo-controls">
        <div className="notification-demo-order">
          <fieldset className="notification-demo-scenarios" disabled={running}>
            <legend>Delivery</legend>
            <label>
              <input
                type="radio"
                name="notification-delivery"
                checked={!retry}
                onChange={() => setRetry(false)}
              />
              <span>Direct delivery</span>
            </label>
            <label>
              <input
                type="radio"
                name="notification-delivery"
                checked={retry}
                onChange={() => setRetry(true)}
              />
              <span>Retry once</span>
            </label>
          </fieldset>
          <div className="notification-demo-progress">
            {phase !== "idle" && (
              <ThoughtLine
                working={running}
                label={progressCopy[phase]}
                doneLabel={progressCopy[phase]}
                glyph="dot"
                fontSize={14}
                showTimer={false}
                shimmer={false}
                breathDepth={0.15}
                settleBlur={0}
              />
            )}
          </div>
        </div>
        <div className="notification-demo-place" ref={control}>
          <SlideCommit
            key={run}
            label="Slide to place order"
            doneLabel="Order placed"
            errorLabel="Try placing the order again"
            pendingLabel="Placing order…"
            onConfirm={placeOrder}
            disabled={!active || !visible}
            width={width}
            height={52}
            radius={26}
            trackColor="#191921"
            handleColor="#9bafff"
            successColor="#a4dbb5"
            holdMs={1000}
          />
          <p>Drag the handle, or focus it and press Enter.</p>
        </div>
      </div>
      <NotificationsFlow phase={phase} orderId={orderId} />
      <div className="notification-demo-footer">
        <p className="notification-demo-decision">{notificationDecision}</p>
        <button
          type="button"
          className="notification-demo-reset"
          onClick={reset}
          disabled={phase === "idle"}
          aria-label="Reset example"
        >
          Reset
        </button>
      </div>
      {active && toastOpen && (
        <SwipeToast
          title="Order confirmed"
          description={
            attempt > 1
              ? "Delivered by email after one retry."
              : "Confirmation delivered by email."
          }
          onClose={() => setToastOpen(false)}
          closeButton
          duration={6500}
          width={340}
          background="#22222f"
          color="#f5f3fb"
          fuseColor="#a4dbb5"
          radius={14}
          className="notification-confirmation"
          icon={
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="m5 12 4 4 10-10" />
            </svg>
          }
        />
      )}
    </div>
  );
}
