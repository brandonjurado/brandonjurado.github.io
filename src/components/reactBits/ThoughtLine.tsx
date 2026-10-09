// Adapted from the supplied React Bits ThoughtLine source (reactbits.dev).
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode
} from "react";
import {animate, useReducedMotion} from "motion/react";
import "./ThoughtLine.css";

export interface ThoughtLineProps {
  label?: string;
  doneLabel?: string;
  renderLabel?: (text: string, working: boolean) => ReactNode;
  glyph?: "sparkle" | "dot" | "none" | ReactNode;
  steps?: readonly string[];
  collapsible?: boolean;
  collapseOnSettle?: boolean;
  color?: string;
  glyphColor?: string;
  fontSize?: number;
  breathPeriod?: number;
  breathDepth?: number;
  shimmer?: boolean;
  shimmerDuration?: number;
  settleDuration?: number;
  settleBlur?: number;
  working?: boolean;
  settleAfter?: number;
  elapsed?: number;
  showTimer?: boolean;
  onSettle?: (seconds: number) => void;
  className?: string;
  style?: CSSProperties;
}

type ThoughtStyle = CSSProperties & Record<`--tl-${string}`, string>;
type RunningAnimation = {stop: () => void};

const EMPTY_STEPS: readonly string[] = [];
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
const formatTime = (deciseconds: number) =>
  deciseconds < 600
    ? `${(deciseconds / 10).toFixed(1)}s`
    : `${Math.floor(deciseconds / 600)}m ${((deciseconds % 600) / 10).toFixed(1)}s`;
const spokenTime = (deciseconds: number) =>
  deciseconds < 600
    ? `${(deciseconds / 10).toFixed(1)} seconds`
    : `${Math.floor(deciseconds / 600)} minutes ${((deciseconds % 600) / 10).toFixed(1)} seconds`;

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export default function ThoughtLine({
  label = "Thinking…",
  doneLabel = "",
  renderLabel,
  glyph = "sparkle",
  steps = EMPTY_STEPS,
  collapsible = true,
  collapseOnSettle = true,
  color = "currentColor",
  glyphColor = "",
  fontSize = 16,
  breathPeriod = 1.6,
  breathDepth = 0.45,
  shimmer = true,
  shimmerDuration = 1.8,
  settleDuration = 350,
  settleBlur = 2,
  working = true,
  settleAfter = 0,
  elapsed,
  showTimer = true,
  onSettle,
  className = "",
  style
}: ThoughtLineProps) {
  const reduce = useReducedMotion();
  const traceId = useId();
  const [autoSettled, setAutoSettled] = useState(false);
  const [open, setOpen] = useState(true);
  const isWorking = working && !autoSettled;
  const doneText = doneLabel || (showTimer ? "Thought for" : "Done thinking");
  const currentStep = steps[steps.length - 1] || label;
  const [announce, setAnnounce] = useState(
    isWorking
      ? currentStep
      : showTimer
        ? `${doneText} ${spokenTime(Math.round((elapsed ?? 0) * 10))}`
        : doneText
  );
  const hasTrace = steps.length > 0;
  const toggle = hasTrace && collapsible;
  const sheen = shimmer && !reduce;
  const glyphRef = useRef<HTMLSpanElement>(null);
  const breathRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);
  const stackRef = useRef<HTMLSpanElement>(null);
  const workRef = useRef<HTMLSpanElement>(null);
  const doneRef = useRef<HTMLSpanElement>(null);
  const deciseconds = useRef(Math.max(0, Math.round((elapsed ?? 0) * 10)));
  const previousWorking = useRef(isWorking);
  const previousLayoutWorking = useRef(isWorking);
  const latest = useRef({onSettle});
  latest.current = {onSettle};

  useEffect(() => {
    if (working) setAutoSettled(false);
  }, [working]);

  useEffect(() => {
    if (isWorking) setOpen(true);
    else if (collapseOnSettle) setOpen(false);
  }, [isWorking, collapseOnSettle]);

  useEffect(() => {
    const glyphElement = glyphRef.current;
    const breathElement = breathRef.current;
    if (!breathElement) return;
    const depth = reduce ? 0 : Math.max(0, Math.min(1, breathDepth));
    const trough = 1 - depth;
    const running: RunningAnimation[] = [];
    let cancelled = false;
    const loop = (element: HTMLElement, delay: number) =>
      animate(
        element,
        {opacity: [trough, 1, trough]},
        {
          duration: Math.max(0.1, breathPeriod),
          ease: EASE_IN_OUT,
          repeat: Infinity,
          delay
        }
      );
    if (reduce) {
      if (glyphElement) glyphElement.style.opacity = isWorking ? "1" : "0.55";
      breathElement.style.opacity = "1";
      return;
    }
    if (isWorking && depth > 0) {
      if (sheen)
        running.push(animate(breathElement, {opacity: 1}, {duration: 0.2}));
      if (glyphElement) {
        const lead = animate(
          glyphElement,
          {opacity: trough},
          {duration: 0.2, ease: EASE_OUT}
        );
        running.push(lead);
        void lead.then(() => {
          if (cancelled) return;
          running.push(loop(glyphElement, 0));
          if (!sheen) running.push(loop(breathElement, 0.14));
        });
      } else if (!sheen) running.push(loop(breathElement, 0.14));
    } else {
      const transition = {
        duration: isWorking ? 0.2 : Math.max(0, settleDuration) / 1000,
        ease: EASE_OUT
      };
      if (glyphElement)
        running.push(
          animate(glyphElement, {opacity: isWorking ? 1 : 0.55}, transition)
        );
      running.push(animate(breathElement, {opacity: 1}, transition));
    }
    return () => {
      cancelled = true;
      running.forEach(animation => animation.stop());
    };
  }, [
    isWorking,
    reduce,
    breathDepth,
    breathPeriod,
    settleDuration,
    glyph,
    sheen
  ]);

  useEffect(() => {
    const paint = (value: number) => {
      deciseconds.current = Math.max(0, value);
      if (timerRef.current)
        timerRef.current.textContent = formatTime(deciseconds.current);
    };
    if (elapsed != null) {
      paint(Math.round(elapsed * 10));
      return;
    }
    if (
      !isWorking ||
      (!showTimer && settleAfter <= 0 && !latest.current.onSettle)
    )
      return;
    const startedAt = performance.now();
    paint(0);
    const interval = setInterval(() => {
      const value = Math.floor((performance.now() - startedAt) / 100);
      paint(value);
      if (settleAfter > 0 && value >= Math.round(settleAfter * 10))
        setAutoSettled(true);
    }, 100);
    return () => clearInterval(interval);
  }, [isWorking, elapsed, settleAfter, showTimer]);

  useEffect(() => {
    const timerElement = timerRef.current;
    const stack = stackRef.current;
    if (!timerElement || !stack || reduce) return;
    const place = (glide: boolean) => {
      const active = isWorking ? workRef.current : doneRef.current;
      if (!active) return;
      if (!glide) timerElement.style.transition = "none";
      timerElement.style.transform = `translateX(${active.offsetWidth - stack.offsetWidth}px)`;
      if (!glide) {
        void timerElement.offsetWidth;
        timerElement.style.transition = "";
      }
    };
    place(previousLayoutWorking.current !== isWorking);
    previousLayoutWorking.current = isWorking;
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => place(false));
    if (workRef.current) observer.observe(workRef.current);
    if (doneRef.current) observer.observe(doneRef.current);
    return () => observer.disconnect();
  }, [isWorking, label, doneText, fontSize, showTimer, reduce]);

  useEffect(() => {
    if (previousWorking.current && !isWorking) {
      latest.current.onSettle?.(deciseconds.current / 10);
    }
    previousWorking.current = isWorking;
  }, [isWorking]);

  useEffect(() => {
    setAnnounce(
      isWorking
        ? currentStep
        : showTimer
          ? `${doneText} ${spokenTime(deciseconds.current)}`
          : doneText
    );
  }, [isWorking, currentStep, doneText, showTimer]);
  const head = (
    <>
      {glyph !== "none" ? (
        <span ref={glyphRef} className="thought-line__glyph" aria-hidden="true">
          {glyph === "sparkle" ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="m10 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Zm9-2v6m-3-3h6m-3 12v6m-3-3h6" />
            </svg>
          ) : glyph === "dot" ? (
            <span className="thought-line__dot" />
          ) : (
            glyph
          )}
        </span>
      ) : null}
      <span ref={stackRef} className="thought-line__label" aria-hidden="true">
        <span
          ref={workRef}
          className="thought-line__text"
          data-active={isWorking ? "" : undefined}
        >
          <span
            ref={breathRef}
            className="thought-line__breath"
            data-shimmer={sheen ? "" : undefined}
          >
            {renderLabel ? renderLabel(label, true) : label}
          </span>
        </span>
        <span
          ref={doneRef}
          className="thought-line__text thought-line__text--done"
          data-active={isWorking ? undefined : ""}
        >
          {renderLabel ? renderLabel(doneText, false) : doneText}
        </span>
      </span>
      {showTimer ? (
        <span
          ref={timerRef}
          className="thought-line__timer"
          data-done={isWorking ? undefined : ""}
          aria-hidden="true"
        >
          {formatTime(deciseconds.current)}
        </span>
      ) : null}
      {toggle ? (
        <span className="thought-line__chevron" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      ) : null}
    </>
  );

  return (
    <div
      className={`thought-line${className ? ` ${className}` : ""}`}
      data-working={isWorking ? "" : undefined}
      data-open={open && hasTrace ? "" : undefined}
      style={
        {
          "--tl-font": `${fontSize}px`,
          "--tl-color": color,
          "--tl-glyph": glyphColor || color,
          "--tl-settle": `${settleDuration}ms`,
          "--tl-blur": `${settleBlur}px`,
          "--tl-shimmer": `${shimmerDuration}s`,
          ...style
        } as ThoughtStyle
      }
    >
      {toggle ? (
        <button
          type="button"
          className="thought-line__head"
          data-toggle=""
          aria-label={`${isWorking ? label : doneText}. ${open ? "Hide" : "Show"} progress details`}
          aria-expanded={open}
          aria-controls={traceId}
          onClick={() => setOpen(value => !value)}
        >
          {head}
        </button>
      ) : (
        <div className="thought-line__head">{head}</div>
      )}
      <span className="thought-line__sr" role="status" aria-atomic="true">
        {announce}
      </span>
      {hasTrace ? (
        <div
          id={traceId}
          className="thought-line__trace"
          data-open={open ? "" : undefined}
          aria-hidden={!open}
        >
          <div className="thought-line__fold">
            <ol className="thought-line__steps">
              {steps.map((text, index) => {
                const done = !isWorking || index < steps.length - 1;
                return (
                  <li
                    key={`${index}-${text}`}
                    className="thought-line__step"
                    data-done={done ? "" : undefined}
                  >
                    <span className="thought-line__mark" aria-hidden="true">
                      {done ? (
                        <CheckIcon />
                      ) : (
                        <i className="thought-line__pulse" />
                      )}
                    </span>
                    <span className="thought-line__step-text">{text}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      ) : null}
    </div>
  );
}
