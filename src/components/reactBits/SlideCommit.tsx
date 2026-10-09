"use client";

// Adapted from the supplied React Bits SlideCommit: https://reactbits.dev
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform
} from "motion/react";
import "./SlideCommit.css";

export interface SlideCommitProps {
  label?: ReactNode;
  doneLabel?: ReactNode;
  errorLabel?: ReactNode;
  pendingLabel?: string;
  onConfirm?: () => void | Promise<void>;
  onDone?: () => void;
  onError?: (reason: unknown) => void;
  trackColor?: string;
  handleColor?: string;
  successColor?: string;
  dangerColor?: string;
  width?: number;
  height?: number;
  radius?: number;
  speed?: number;
  returnBounce?: number;
  landingDip?: number;
  holdMs?: number;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
  "aria-label"?: string;
}

type Phase = "idle" | "pending" | "done" | "error";
interface Grip {
  id: number;
  grab: number;
  history: [number, number][];
}

const PAD = 4;
const SQUASH_MAX = 0.08;
const SQUASH_DIV = 110;
const SWELL = 1.03;
const MIN_PENDING = 300;
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const SHAKE = [0, -5, 5, -3, 3, -1, 0];
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const onColor = (color: string) => {
  const raw = color.replace("#", "");
  if (!/^(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(raw)) return "#ffffff";
  const full =
    raw.length === 3
      ? [...raw].map(character => character + character).join("")
      : raw.slice(0, 6);
  const number = Number.parseInt(full, 16);
  const [red, green, blue] = [
    (number >> 16) & 255,
    (number >> 8) & 255,
    number & 255
  ].map(channel => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
  return luminance > 0.179 ? "#000000" : "#ffffff";
};
const velocityOf = (history: [number, number][]) => {
  if (history.length < 2) return 0;
  const [firstTime, firstX] = history[0];
  const [lastTime, lastX] = history[history.length - 1];
  return ((lastX - firstX) / Math.max(1, lastTime - firstTime)) * 1000;
};

function Arrow({size}: {size: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 12h16m-6-6 6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Check({size}: {size: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m5 12 4 4L19 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner({size}: {size: number}) {
  return (
    <svg
      className="slide-commit__spinner"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeOpacity="0.25"
      />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SlideCommit({
  label = "Slide to confirm",
  doneLabel = "Confirmed",
  errorLabel = "Confirmation failed",
  pendingLabel = "Working",
  onConfirm,
  onDone,
  onError,
  trackColor = "#262626",
  handleColor = "#f5f5f5",
  successColor = "#22c55e",
  dangerColor = "#e5484d",
  width = 280,
  height = 56,
  radius = 28,
  speed = 50,
  returnBounce = 0.38,
  landingDip = 0.026,
  holdMs = 1500,
  disabled = false,
  icon,
  className = "",
  "aria-label": ariaLabel
}: SlideCommitProps) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const [held, setHeld] = useState(false);
  const [hot, setHot] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);
  const grip = useRef<Grip | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const homeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const run = useRef(0);

  const trackHeight = Math.max(24, height);
  const trackWidth = Math.max(trackHeight + 1, width);
  const gripSize = trackHeight - PAD * 2;
  const innerWidth = trackWidth - PAD * 2;
  const travel = innerWidth - gripSize;
  const trackRadius = clamp(radius, 0, trackHeight / 2);
  const gripRadius = Math.max(0, trackRadius - PAD);
  const stiffness = 260 + (clamp(speed, 0, 100) / 100) * 640;
  const mass = 0.9;
  const critical = 2 * Math.sqrt(stiffness * mass);
  const commitSpring = {
    type: "spring",
    stiffness,
    damping: critical,
    mass
  } as const;
  const homeSpring = {
    ...commitSpring,
    damping: critical * (1 - clamp(returnBounce, 0, 0.5))
  };

  const x = useMotionValue(0);
  const anchor = useMotionValue(0);
  const shown = useMotionValue(1);
  const spin = useMotionValue(0);
  const pulse = useMotionValue(1);
  const shake = useMotionValue(0);
  const seen = useTransform(x, value => clamp(value, 0, travel));
  const edge = useTransform(
    () => seen.get() + gripSize + clamp(anchor.get() - seen.get(), 0, travel)
  );
  const clip = useTransform(
    () => `inset(0 ${innerWidth - edge.get()}px 0 0 round ${gripRadius}px)`
  );
  const content = useTransform(
    () => `translateX(${(seen.get() + edge.get()) / 2 - innerWidth / 2}px)`
  );
  const swell = hot && !held && phase === "idle" && !reduce ? SWELL : 1;
  const shape = useTransform(() => {
    const squash = 1 - Math.min(SQUASH_MAX, Math.max(0, -x.get()) / SQUASH_DIV);
    return `scale(${squash * swell}, ${swell / squash})`;
  });
  const origin = useTransform(seen, value => `${value}px 50%`);
  const say = useTransform(seen, [0, travel * 0.55], [1, 0]);
  const arrow = useTransform(
    () =>
      shown.get() *
      clamp(1 - (seen.get() - travel * 0.55) / (travel * 0.4), 0, 1)
  );
  const trackTransform = useTransform(
    () => `translateX(${shake.get()}px) scale(${pulse.get()})`
  );

  const labelText =
    ariaLabel ?? (typeof label === "string" ? label : "Slide to confirm");
  const doneText = typeof doneLabel === "string" ? doneLabel : "Confirmed";
  const errorText = typeof errorLabel === "string" ? errorLabel : "Try again";
  const valueText = (percent: number, currentPhase: Phase) => {
    if (currentPhase === "pending") return pendingLabel;
    if (currentPhase === "done") return doneText;
    if (currentPhase === "error") return errorText;
    return `${percent}%. Slide right or press Enter to confirm`;
  };
  useMotionValueEvent(seen, "change", value => {
    const currentPhase = phaseRef.current;
    const percent =
      currentPhase === "pending" || currentPhase === "done"
        ? 100
        : Math.round((value / travel) * 100);
    capsuleRef.current?.setAttribute("aria-valuenow", String(percent));
    capsuleRef.current?.setAttribute(
      "aria-valuetext",
      valueText(percent, currentPhase)
    );
  });

  const changePhase = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };
  const clearTimers = () => {
    for (const timeout of [timer, homeTimer, pendingTimer]) {
      if (timeout.current !== null) clearTimeout(timeout.current);
      timeout.current = null;
    }
  };
  const releaseGrip = () => {
    const current = grip.current;
    grip.current = null;
    if (current && trackRef.current?.hasPointerCapture?.(current.id)) {
      trackRef.current.releasePointerCapture(current.id);
    }
    setHeld(false);
  };
  const goHome = (velocity: number) => {
    if (reduce) x.set(0);
    else animate(x, 0, {...homeSpring, velocity: Math.min(0, velocity)});
  };

  useEffect(
    () => () => {
      clearTimers();
      run.current += 1;
      const current = grip.current;
      grip.current = null;
      if (current && trackRef.current?.hasPointerCapture?.(current.id)) {
        trackRef.current.releasePointerCapture(current.id);
      }
      for (const value of [x, anchor, shown, spin, pulse, shake]) value.stop();
    },
    [x, anchor, shown, spin, pulse, shake]
  );

  useEffect(() => {
    if (disabled && grip.current) {
      releaseGrip();
      goHome(0);
    }
  }, [disabled]);

  useEffect(() => {
    if (grip.current) {
      releaseGrip();
      goHome(0);
    } else if (phaseRef.current === "pending") x.set(travel);
    else if (phaseRef.current === "done") {
      anchor.set(travel);
      x.set(0);
    } else x.set(clamp(x.get(), 0, travel));
  }, [travel, x, anchor]);

  const settle = () => {
    changePhase("idle");
    if (reduce) {
      shown.set(1);
      anchor.set(0);
    } else {
      animate(shown, 1, {duration: 0.2, delay: 0.12});
      animate(anchor, 0, {type: "spring", duration: 0.3, bounce: 0});
    }
  };
  const resolve = (viaKey: boolean) => {
    changePhase("done");
    anchor.set(x.get());
    spin.set(0);
    if (reduce) x.set(0);
    else {
      animate(x, 0, commitSpring);
      if (!viaKey && landingDip > 0) {
        animate(pulse, [1, 1 - clamp(landingDip, 0, 0.1), 1], {
          duration: 0.46,
          times: [0, 0.62, 1],
          ease: EASE_OUT,
          delay: 0.1
        });
      }
    }
    if (holdMs > 0) timer.current = setTimeout(settle, holdMs);
    onDone?.();
  };
  const reject = (reason: unknown) => {
    changePhase("error");
    spin.set(0);
    if (reduce) {
      shown.set(1);
      goHome(0);
    } else {
      animate(shown, 1, {duration: 0.2, delay: 0.12});
      animate(shake, SHAKE, {duration: 0.45, ease: EASE_OUT});
      homeTimer.current = setTimeout(() => {
        if (!grip.current) goHome(0);
      }, 300);
    }
    timer.current = setTimeout(
      () => changePhase("idle"),
      Math.max(holdMs, 1500)
    );
    onError?.(reason);
  };
  const commit = (viaKey: boolean) => {
    if (
      disabled ||
      phaseRef.current === "pending" ||
      phaseRef.current === "done"
    )
      return;
    clearTimers();
    releaseGrip();
    const id = ++run.current;
    changePhase("pending");
    x.set(travel);
    let result: void | Promise<void>;
    try {
      result = onConfirm?.();
    } catch (reason) {
      reject(reason);
      return;
    }
    if (!result || typeof result.then !== "function") {
      shown.set(0);
      resolve(viaKey);
      return;
    }
    if (reduce) {
      shown.set(0);
      spin.set(1);
    } else {
      animate(shown, 0, {duration: 0.2});
      animate(spin, 1, {duration: 0.2});
    }
    const started = performance.now();
    const later = (finish: () => void) => {
      if (id !== run.current) return;
      pendingTimer.current = setTimeout(
        () => {
          pendingTimer.current = null;
          if (id === run.current) finish();
        },
        Math.max(0, MIN_PENDING - (performance.now() - started))
      );
    };
    result.then(
      () => later(() => resolve(viaKey)),
      reason => later(() => reject(reason))
    );
  };

  const local = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    return rect ? (clientX - rect.left) / (rect.width / trackWidth || 1) : 0;
  };
  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (
      disabled ||
      grip.current ||
      phaseRef.current === "pending" ||
      phaseRef.current === "done" ||
      event.button !== 0
    )
      return;
    x.stop();
    if (homeTimer.current !== null) clearTimeout(homeTimer.current);
    grip.current = {
      id: event.pointerId,
      grab: local(event.clientX) - x.get(),
      history: [[event.timeStamp, x.get()]]
    };
    setHeld(true);
    capsuleRef.current?.focus({preventScroll: true});
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // The browser can release a pointer before capture is requested.
    }
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const current = grip.current;
    if (!current || current.id !== event.pointerId) return;
    const next = clamp(local(event.clientX) - current.grab, 0, travel);
    current.history.push([event.timeStamp, next]);
    if (current.history.length > 4) current.history.shift();
    x.set(next);
  };
  const up = (event: PointerEvent<HTMLDivElement>) => {
    const current = grip.current;
    if (!current || current.id !== event.pointerId) return;
    releaseGrip();
    if (x.get() >= travel) commit(false);
    else goHome(velocityOf(current.history));
  };
  const cancel = (event: PointerEvent<HTMLDivElement>) => {
    if (grip.current?.id !== event.pointerId) return;
    releaseGrip();
    goHome(0);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      [
        "Enter",
        " ",
        "End",
        "ArrowRight",
        "ArrowUp",
        "ArrowLeft",
        "ArrowDown",
        "Home",
        "Escape"
      ].includes(event.key)
    )
      event.preventDefault();
    if (
      disabled ||
      phaseRef.current === "pending" ||
      phaseRef.current === "done"
    )
      return;
    if (event.key === "Enter" || event.key === " " || event.key === "End") {
      event.preventDefault();
      if (!event.repeat) commit(true);
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      x.stop();
      const next = Math.min(travel, x.get() + travel / 10);
      x.set(next);
      if (next >= travel - 0.01) commit(true);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      x.stop();
      x.set(Math.max(0, x.get() - travel / 10));
    } else if (event.key === "Home" || event.key === "Escape") {
      event.preventDefault();
      releaseGrip();
      goHome(0);
    }
  };

  const fontSize = clamp(Math.round(trackHeight * 0.25), 13, 17);
  const iconSize = Math.round(gripSize * 0.42);
  const done = phase === "done";
  const percent =
    done || phase === "pending" ? 100 : Math.round((seen.get() / travel) * 100);

  return (
    <div
      className={`slide-commit${className ? ` ${className}` : ""}`}
      data-phase={phase}
      data-held={held ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      style={
        {
          width: trackWidth,
          height: trackHeight,
          "--sc-track": trackColor,
          "--sc-ink": handleColor,
          "--sc-ok": successColor,
          "--sc-no": dangerColor,
          "--sc-on-ink": onColor(handleColor),
          "--sc-on-ok": onColor(successColor),
          "--sc-on-no": onColor(dangerColor),
          "--sc-radius": `${trackRadius}px`,
          "--sc-grip-r": `${gripRadius}px`,
          "--sc-pad": `${PAD}px`,
          "--sc-font": `${fontSize}px`
        } as CSSProperties
      }
    >
      <motion.div
        ref={trackRef}
        className="slide-commit__track"
        style={{transform: trackTransform}}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={cancel}
        onLostPointerCapture={cancel}
      >
        <motion.span
          className="slide-commit__label"
          style={{opacity: phase === "pending" ? 1 : say}}
          aria-hidden="true"
        >
          <span className="slide-commit__text slide-commit__text--plain">
            {phase === "pending" ? pendingLabel : label}
          </span>
          <span className="slide-commit__text slide-commit__text--error">
            {errorLabel}
          </span>
        </motion.span>
        <motion.div
          ref={capsuleRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={labelText}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-valuetext={valueText(percent, phase)}
          aria-busy={phase === "pending" || undefined}
          aria-disabled={disabled || phase === "pending" || done || undefined}
          className="slide-commit__capsule"
          style={{clipPath: clip, transform: shape, transformOrigin: origin}}
          onPointerEnter={event => {
            if (
              event.pointerType === "mouse" &&
              window.matchMedia("(hover: hover) and (pointer: fine)").matches
            )
              setHot(true);
          }}
          onPointerLeave={() => setHot(false)}
          onKeyDown={onKeyDown}
        >
          <motion.div
            className="slide-commit__content"
            style={{transform: content}}
          >
            <motion.span
              className="slide-commit__arrow"
              style={{opacity: arrow}}
              aria-hidden="true"
            >
              {icon ?? <Arrow size={iconSize} />}
            </motion.span>
            <motion.span
              className="slide-commit__spin"
              style={{opacity: spin}}
              aria-hidden="true"
            >
              <Spinner size={iconSize} />
            </motion.span>
            <motion.span
              className="slide-commit__done"
              aria-hidden="true"
              initial={false}
              animate={{
                opacity: done ? 1 : 0,
                scale: done || reduce ? 1 : 0.95
              }}
              transition={{duration: reduce ? 0 : 0.2, ease: EASE_OUT}}
            >
              <Check size={Math.round(gripSize * 0.38)} />
              {doneLabel}
            </motion.span>
          </motion.div>
        </motion.div>
        <span className="slide-commit__sr" role="status" aria-live="polite">
          {phase === "pending"
            ? pendingLabel
            : done
              ? doneLabel
              : phase === "error"
                ? errorLabel
                : ""}
        </span>
      </motion.div>
    </div>
  );
}
