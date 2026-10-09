// Adapted from the supplied React Bits SwipeToast source (reactbits.dev).
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode
} from "react";
import {animate, motion, useMotionValue, useReducedMotion} from "motion/react";
import "./SwipeToast.css";

export type SwipeToastCloseReason =
  | "timeout"
  | "swipe"
  | "action"
  | "close"
  | "escape"
  | "programmatic";

export interface SwipeToastProps {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actionLabel?: ReactNode;
  onAction?: () => void;
  open?: boolean;
  onClose?: (reason: SwipeToastCloseReason) => void;
  background?: string;
  color?: string;
  fuseColor?: string;
  width?: number;
  radius?: number;
  slideMs?: number;
  settleBounce?: number;
  swipeDistance?: number;
  duration?: number;
  fuse?: "bottom" | "top" | "none";
  pauseOnHover?: boolean;
  closeButton?: boolean;
  inline?: boolean;
  dismissible?: boolean;
  className?: string;
}

type Phase = "open" | "closing" | "gone";
type Drag = {
  id: number;
  startY: number;
  grab: number | null;
  moved: boolean;
  history: [number, number][];
};
type RunningAnimation = {stop: () => void};
type ToastStyle = CSSProperties & Record<`--st-${string}`, string>;

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const rubberband = (over: number) =>
  (over * 24 * 0.55) / (24 + 0.55 * Math.abs(over));

function velocityOf(history: [number, number][]) {
  if (history.length < 2) return 0;
  const [t0, y0] = history[0];
  const [t1, y1] = history[history.length - 1];
  return performance.now() - t1 > 100 ? 0 : (y1 - y0) / Math.max(1, t1 - t0);
}

export default function SwipeToast({
  title = "File archived",
  description = "",
  icon,
  actionLabel = "",
  onAction,
  open = true,
  onClose,
  background = "#27272a",
  color = "#f5f5f5",
  fuseColor = "#f5a524",
  width = 356,
  radius = 12,
  slideMs = 400,
  settleBounce = 0.2,
  swipeDistance = 40,
  duration = 4000,
  fuse = "bottom",
  pauseOnHover = true,
  closeButton = false,
  inline = false,
  dismissible = true,
  className = ""
}: SwipeToastProps) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(open ? "open" : "gone");
  const [mounted, setMounted] = useState(false);
  const [instant, setInstant] = useState(false);
  const [swipeExit, setSwipeExit] = useState(false);
  const phaseRef = useRef(phase);
  const alive = useRef(false);
  const closeSequence = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const fuseRef = useRef<HTMLElement>(null);
  const drag = useRef<Drag | null>(null);
  const pendingClose = useRef<SwipeToastCloseReason | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const animations = useRef(new Set<RunningAnimation>());
  const flags = useRef({hover: false, interacting: false, focus: false});
  const syncTimer = useRef(() => {});
  const lastInput = useRef<"keyboard" | "pointer">("pointer");
  const latest = useRef({onClose, onAction, slideMs, inline});
  latest.current = {onClose, onAction, slideMs, inline};
  const y = useMotionValue(0);
  const fade = useMotionValue(1);

  const stopAnimations = useCallback(() => {
    animations.current.forEach(animation => animation.stop());
    animations.current.clear();
    y.stop();
    fade.stop();
  }, [y, fade]);

  const finish = useCallback(
    (reason: SwipeToastCloseReason, sequence: number) => {
      if (
        !alive.current ||
        phaseRef.current !== "closing" ||
        closeSequence.current !== sequence
      )
        return;
      phaseRef.current = "gone";
      setPhase("gone");
      latest.current.onClose?.(reason);
    },
    []
  );

  const close = useCallback(
    (reason: SwipeToastCloseReason) => {
      if (phaseRef.current !== "open") return;
      if (drag.current) {
        pendingClose.current = reason;
        return;
      }
      const immediate =
        reduce ||
        reason === "escape" ||
        ((reason === "action" || reason === "close") &&
          lastInput.current === "keyboard");
      phaseRef.current = "closing";
      const sequence = ++closeSequence.current;
      setInstant(Boolean(immediate));
      setPhase("closing");
      clearTimeout(closeTimer.current);
      closeTimer.current = setTimeout(
        () => finish(reason, sequence),
        immediate ? 0 : Math.max(0, latest.current.slideMs) * 0.7 + 60
      );
    },
    [finish, reduce]
  );

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      closeSequence.current += 1;
      clearTimeout(closeTimer.current);
      stopAnimations();
    };
  }, [stopAnimations]);

  useEffect(() => {
    if (!open) {
      close("programmatic");
      return;
    }
    if (phaseRef.current !== "open") {
      closeSequence.current += 1;
      clearTimeout(closeTimer.current);
      stopAnimations();
      drag.current = null;
      pendingClose.current = null;
      flags.current = {hover: false, interacting: false, focus: false};
      y.set(0);
      fade.set(1);
      setInstant(false);
      setSwipeExit(false);
      setMounted(false);
      phaseRef.current = "open";
      setPhase("open");
    }
    // The controlled prop starts a new presence only when it changes.
  }, [open]);

  useEffect(() => {
    if (phase !== "open") return;
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => {
    if (phase !== "open" || duration <= 0) return;
    let remaining = duration;
    let startedAt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let running = false;
    const fuseElement = fuseRef.current;
    const burn =
      !reduce && fuseElement?.animate
        ? fuseElement.animate(
            [{transform: "scaleX(1)"}, {transform: "scaleX(0)"}],
            {duration, easing: "linear", fill: "forwards"}
          )
        : undefined;
    burn?.pause();
    const sync = () => {
      const paused =
        (pauseOnHover && flags.current.hover) ||
        flags.current.focus ||
        flags.current.interacting ||
        document.hidden;
      if (paused && running) {
        remaining = Math.max(0, remaining - (performance.now() - startedAt));
        clearTimeout(timer);
        running = false;
        burn?.pause();
      } else if (!paused && !running) {
        startedAt = performance.now();
        running = true;
        timer = setTimeout(() => close("timeout"), remaining);
        burn?.play();
      }
    };
    syncTimer.current = sync;
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      clearTimeout(timer);
      burn?.cancel();
      syncTimer.current = () => {};
      document.removeEventListener("visibilitychange", sync);
    };
  }, [phase, duration, pauseOnHover, close, reduce]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    lastInput.current = "pointer";
    if (
      event.button !== 0 ||
      !dismissible ||
      drag.current ||
      phaseRef.current !== "open" ||
      (event.target instanceof Element && event.target.closest("button"))
    )
      return;
    stopAnimations();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // A pointer may have ended between the event and capture.
    }
    drag.current = {
      id: event.pointerId,
      startY: event.clientY,
      grab: null,
      moved: false,
      history: [[performance.now(), y.get()]]
    };
    flags.current.interacting = true;
    syncTimer.current();
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    if (current.grab === null) {
      if (Math.abs(event.clientY - current.startY) < 3) return;
      current.grab = event.clientY - y.get();
      event.currentTarget.dataset.swiping = "";
    }
    const raw = event.clientY - current.grab;
    const next = raw >= 0 ? raw : rubberband(raw);
    y.set(next);
    current.moved = true;
    current.history.push([performance.now(), next]);
    if (current.history.length > 4) current.history.shift();
  }

  function releasePointer(
    event: PointerEvent<HTMLDivElement>,
    cancelled = false
  ) {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    drag.current = null;
    delete event.currentTarget.dataset.swiping;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    flags.current.interacting = false;
    const distance = y.get();
    const velocity = velocityOf(current.history);
    if (
      !cancelled &&
      distance > 0 &&
      (velocity > 0.11 || (distance >= swipeDistance && velocity >= 0))
    ) {
      pendingClose.current = null;
      phaseRef.current = "closing";
      const sequence = ++closeSequence.current;
      setSwipeExit(true);
      setInstant(true);
      setPhase("closing");
      // Keep the gesture's departure on the card; the lift must stay still.
      if (!reduce) {
        const slide = animate(y, distance + event.currentTarget.offsetHeight, {
          type: "spring",
          duration: 0.3,
          bounce: 0,
          velocity: velocity * 1000
        });
        animations.current.add(slide);
      }
      const exit = animate(fade, 0, {
        duration: reduce ? 0 : 0.2,
        ease: EASE_OUT
      });
      animations.current.add(exit);
      void exit.then(() => finish("swipe", sequence));
      return;
    }
    if (current.moved) {
      if (reduce) y.set(0);
      else {
        const settle = animate(y, 0, {
          type: "spring",
          duration: 0.5,
          bounce: settleBounce,
          velocity: velocity * 1000
        });
        animations.current.add(settle);
      }
    }
    const queued = pendingClose.current;
    pendingClose.current = null;
    if (queued) close(queued);
    else syncTimer.current();
  }

  if (phase === "gone") return null;

  return (
    <div
      className={`swipe-toast${className ? ` ${className}` : ""}`}
      data-phase={phase}
      data-inline={inline ? "true" : "false"}
      data-fuse={duration > 0 ? fuse : "none"}
      data-dismissible={dismissible ? "true" : "false"}
      data-instant={instant ? "" : undefined}
      data-swipe-exit={swipeExit ? "" : undefined}
      data-mounted={mounted ? "true" : "false"}
      style={
        {
          "--st-bg": background,
          "--st-ink": color,
          "--st-fuse": fuseColor,
          "--st-w": `${width}px`,
          "--st-radius": `${radius}px`,
          "--st-slide": `${slideMs}ms`
        } as ToastStyle
      }
    >
      <div className="swipe-toast__gate">
        <div className="swipe-toast__lift">
          <motion.div
            ref={cardRef}
            className="swipe-toast__card"
            tabIndex={dismissible ? 0 : undefined}
            aria-label={
              dismissible ? "Notification. Press Escape to dismiss." : undefined
            }
            style={{y: reduce ? 0 : y, opacity: fade}}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={event => releasePointer(event)}
            onPointerCancel={event => releasePointer(event, true)}
            onLostPointerCapture={event => releasePointer(event, true)}
            onPointerEnter={event => {
              if (event.pointerType === "mouse") {
                flags.current.hover = true;
                syncTimer.current();
              }
            }}
            onPointerLeave={event => {
              if (event.pointerType === "mouse") {
                flags.current.hover = false;
                syncTimer.current();
              }
            }}
            onFocus={() => {
              flags.current.focus = true;
              syncTimer.current();
            }}
            onBlur={event => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                flags.current.focus = false;
                syncTimer.current();
              }
            }}
            onKeyDown={event => {
              lastInput.current = "keyboard";
              if (event.key === "Escape" && dismissible) {
                event.stopPropagation();
                close("escape");
              }
            }}
          >
            {icon ? (
              <span className="swipe-toast__icon" aria-hidden="true">
                {icon}
              </span>
            ) : null}
            <span
              className="swipe-toast__body"
              role="status"
              aria-atomic="true"
            >
              <span className="swipe-toast__title">{title}</span>
              {description ? (
                <span className="swipe-toast__desc">{description}</span>
              ) : null}
            </span>
            {actionLabel ? (
              <button
                type="button"
                className="swipe-toast__action"
                onClick={() => {
                  latest.current.onAction?.();
                  close("action");
                }}
              >
                {actionLabel}
              </button>
            ) : null}
            {closeButton ? (
              <button
                type="button"
                className="swipe-toast__close"
                aria-label="Dismiss notification"
                onClick={() => close("close")}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            ) : null}
            <i ref={fuseRef} className="swipe-toast__fuse" aria-hidden="true" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
