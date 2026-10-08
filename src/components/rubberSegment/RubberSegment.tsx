"use client";

// Adapted from React Bits RubberSegment: https://reactbits.dev
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue
} from "motion/react";
import "./RubberSegment.css";

export interface RubberSegmentItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  href?: string;
}

interface RubberSegmentProps {
  items: (string | RubberSegmentItem)[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, index: number) => void;
  trackColor?: string;
  thumbColor?: string;
  textColor?: string;
  activeTextColor?: string;
  size?: "sm" | "md" | "lg";
  radius?: number;
  inset?: number;
  equalSlots?: boolean;
  stretch?: number;
  squash?: number;
  speed?: number;
  glide?: number;
  draggable?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

interface Slot {
  l: number;
  r: number;
}

interface Drag {
  id: number;
  x0: number;
  slot: number;
  onThumb: boolean;
  live: boolean;
  offset: number;
  w: number;
  hist: [number, number][];
}

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const SPRING_UI = {type: "spring", duration: 0.3, bounce: 0} as const;
const SPRING_MOMENTUM = {type: "spring", duration: 0.4, bounce: 0.2} as const;
const SPRING_RELAX = {type: "spring", duration: 0.16, bounce: 0} as const;
const DILATE = 0.19;
const HANDOFF = 0.15;
const FLICK = 110;
const MAX_VELOCITY = 2000;
const DEADZONE = 4;
const SLOP = 10;
const RUBBER = 0.55;
const SIZES = {
  sm: {height: 28, font: 12, pad: 10, min: 36},
  md: {height: 36, font: 13, pad: 14, min: 44},
  lg: {height: 44, font: 14, pad: 18, min: 48}
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const rubber = (over: number, dim: number) =>
  (over * dim * RUBBER) / (dim + RUBBER * Math.abs(over));
const project = (velocity: number, glide: number) => {
  const decay = 1 - 0.1 * Math.pow(0.05, glide / 100);
  return ((velocity / 1000) * decay) / (1 - decay);
};
const velocityOf = (history: [number, number][], now: number) => {
  const recent = history.filter(([time]) => now - time <= 100);
  if (recent.length < 2) return 0;
  const [t0, x0] = recent[0];
  const [t1, x1] = recent[recent.length - 1];
  return t1 - t0 >= 8 ? ((x1 - x0) / (t1 - t0)) * 1000 : 0;
};
const nearestSlot = (slots: Slot[], x: number) => {
  let best = 0;
  for (let i = 1; i < slots.length; i++) {
    if (
      Math.abs((slots[i].l + slots[i].r) / 2 - x) <
      Math.abs((slots[best].l + slots[best].r) / 2 - x)
    ) {
      best = i;
    }
  }
  return best;
};

export default function RubberSegment({
  items,
  value,
  defaultValue,
  onChange,
  trackColor = "#27272a",
  thumbColor = "#fafafa",
  textColor = "#fafafa",
  activeTextColor = "#18181b",
  size = "md",
  radius = 10,
  inset = 3,
  equalSlots = true,
  stretch = 100,
  squash = 3,
  speed = 1,
  glide = 75,
  draggable = true,
  disabled = false,
  className = "",
  "aria-label": ariaLabel = "Segmented control"
}: RubberSegmentProps) {
  const list = items.map(item =>
    typeof item === "string" ? {value: item, label: item} : item
  );
  const links = list.length > 0 && list.every(item => item.href !== undefined);
  const [inner, setInner] = useState(defaultValue ?? list[0]?.value);
  const [measured, setMeasured] = useState(false);
  const current = value !== undefined ? value : inner;
  const index = Math.max(
    0,
    list.findIndex(item => item.value === current)
  );
  const reduce = useReducedMotion();

  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);
  const slots = useRef<Slot[]>([]);
  const box = useRef<DOMRect | null>(null);
  const committed = useRef(index);
  const handoff = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drag = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const gen = useRef(0);

  const edgeL = useMotionValue(0);
  const edgeR = useMotionValue(0);
  const innerW = useMotionValue(0);
  const thumbRadius = Math.max(0, radius - inset);
  const clipPath = useTransform(
    () =>
      `inset(0 ${Math.max(0, innerW.get() - edgeR.get())}px 0 ${Math.max(0, edgeL.get())}px round ${thumbRadius}px)`
  );
  const t = (seconds: number) => seconds / Math.max(0.01, speed);
  const clearHandoff = () => {
    if (handoff.current !== null) clearTimeout(handoff.current);
    handoff.current = null;
  };

  const jumpTo = (i: number) => {
    const slot = slots.current[i];
    if (!slot) return;
    clearHandoff();
    gen.current += 1;
    edgeL.jump(slot.l);
    edgeR.jump(slot.r);
  };

  const listKey = list.map(item => item.value).join("|");
  useLayoutEffect(() => {
    let alive = true;
    const measure = () => {
      const track = trackRef.current;
      if (!alive || !track) return;
      const rect = track.getBoundingClientRect();
      box.current = rect;
      slots.current = list.map((_, i) => {
        const item = itemRefs.current[i];
        if (!item) return {l: 0, r: 0};
        const bounds = item.getBoundingClientRect();
        return {
          l: bounds.left - rect.left - inset,
          r: bounds.right - rect.left - inset
        };
      });
      innerW.set(rect.width - inset * 2);
      jumpTo(committed.current);
      setMeasured(true);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    void document.fonts?.ready.then(measure);
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, [listKey, size, inset, equalSlots, edgeL, edgeR, innerW]);

  // Scroll-driven selections share the elastic travel; local commits already started it.
  useEffect(() => {
    if (!drag.current && committed.current !== index) {
      const from = committed.current;
      committed.current = index;
      travel(from, index);
    }
  }, [index]);

  useEffect(() => {
    if (reduce) jumpTo(committed.current);
  }, [reduce]);

  useEffect(
    () => () => {
      clearHandoff();
      gen.current += 1;
      edgeL.stop();
      edgeR.stop();
    },
    [edgeL, edgeR]
  );

  const commit = (i: number) => {
    const item = list[i];
    if (!item) return;
    committed.current = i;
    if (i === index) return;
    if (value === undefined) setInner(item.value);
    onChange?.(item.value, i);
  };

  const land = (
    to: number,
    velocity: number | null,
    flick: boolean,
    withSquash: boolean
  ) => {
    const slot = slots.current[to];
    if (!slot) return;
    if (reduce) {
      jumpTo(to);
      return;
    }
    const generation = ++gen.current;
    const direction =
      Math.sign((slot.l + slot.r) / 2 - (edgeL.get() + edgeR.get()) / 2) || 1;
    const [lead, leadTo, trail, trailTo] =
      direction > 0
        ? ([edgeR, slot.r, edgeL, slot.l] as const)
        : ([edgeL, slot.l, edgeR, slot.r] as const);
    const velocityFor = (motionValue: MotionValue<number>) =>
      clamp(
        velocity === null ? motionValue.getVelocity() : velocity,
        -MAX_VELOCITY,
        MAX_VELOCITY
      );
    animate(lead, leadTo, {
      ...(flick ? SPRING_MOMENTUM : SPRING_UI),
      duration: t(flick ? 0.4 : 0.3),
      velocity: velocityFor(lead)
    });
    const trailVelocity = velocityFor(trail);
    if (!withSquash || squash <= 0) {
      animate(trail, trailTo, {
        ...SPRING_UI,
        duration: t(0.3),
        velocity: trailVelocity
      });
      return;
    }
    void animate(trail, trailTo + direction * squash, {
      ...SPRING_UI,
      duration: t(0.3),
      velocity: trailVelocity
    }).then(() => {
      if (gen.current === generation) {
        animate(trail, trailTo, {...SPRING_RELAX, duration: t(0.16)});
      }
    });
  };

  const travel = (from: number, to: number) => {
    const previous = slots.current[from];
    const next = slots.current[to];
    if (!previous || !next) return;
    clearHandoff();
    gen.current += 1;
    if (reduce) {
      edgeL.jump(next.l);
      edgeR.jump(next.r);
      return;
    }
    const amount = stretch / 100;
    const tween = {duration: t(DILATE), ease: EASE_OUT};
    animate(
      edgeL,
      next.l + (Math.min(previous.l, next.l) - next.l) * amount,
      tween
    );
    animate(
      edgeR,
      next.r + (Math.max(previous.r, next.r) - next.r) * amount,
      tween
    );
    handoff.current = setTimeout(
      () => land(to, null, false, true),
      t(HANDOFF) * 1000
    );
  };

  const localX = (event: PointerEvent<HTMLElement>) =>
    event.clientX - (box.current?.left ?? 0) - inset;

  const handlePointerDown = (event: PointerEvent<HTMLElement>, i: number) => {
    if (disabled || drag.current || event.button !== 0) return;
    suppressClick.current = false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    if (!trackRef.current) return;
    box.current = trackRef.current.getBoundingClientRect();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // A released pointer can lose capture before this event is handled.
    }
    const x = localX(event);
    const onThumb = draggable && x >= edgeL.get() && x <= edgeR.get();
    drag.current = {
      id: event.pointerId,
      x0: x,
      slot: i,
      onThumb,
      live: false,
      offset: 0,
      w: 0,
      hist: [[event.timeStamp, x]]
    };
    if (onThumb) {
      clearHandoff();
      gen.current += 1;
      edgeL.stop();
      edgeR.stop();
    } else if (!reduce) {
      event.currentTarget.dataset.pressed = "";
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    const held = drag.current;
    if (!held || event.pointerId !== held.id || !held.onThumb) return;
    const x = localX(event);
    held.hist.push([event.timeStamp, x]);
    if (held.hist.length > 8) held.hist.shift();
    if (!held.live) {
      if (Math.abs(x - held.x0) < DEADZONE) return;
      held.live = true;
      held.offset = x - edgeL.get();
      held.w = edgeR.get() - edgeL.get();
      if (trackRef.current) trackRef.current.dataset.held = "";
    }
    const width = innerW.get();
    const left = x - held.offset;
    const maxLeft = width - held.w;
    if (reduce) {
      const bounded = clamp(left, 0, maxLeft);
      edgeL.set(bounded);
      edgeR.set(bounded + held.w);
    } else if (left < 0) {
      edgeL.set(0);
      edgeR.set(held.w - rubber(-left, held.w));
    } else if (left > maxLeft) {
      edgeR.set(width);
      edgeL.set(maxLeft + rubber(left - maxLeft, held.w));
    } else {
      edgeL.set(left);
      edgeR.set(left + held.w);
    }
  };

  const release = (held: Drag) => {
    drag.current = null;
    if (trackRef.current) delete trackRef.current.dataset.held;
    const item = itemRefs.current[held.slot];
    if (item) delete item.dataset.pressed;
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    const held = drag.current;
    if (!held || event.pointerId !== held.id) return;
    release(held);
    if (!held.live) {
      suppressClick.current = Math.abs(localX(event) - held.x0) > SLOP;
      if (held.onThumb) land(committed.current, null, false, false);
      return;
    }
    suppressClick.current = true;
    const velocity = velocityOf(held.hist, event.timeStamp);
    const flick = Math.abs(velocity) > FLICK;
    let to = nearestSlot(
      slots.current,
      (edgeL.get() + edgeR.get()) / 2 + project(velocity, glide)
    );
    if (flick && to === committed.current) {
      to = clamp(to + Math.sign(velocity), 0, list.length - 1);
    }
    commit(to);
    land(to, velocity, flick, flick);
  };

  const handlePointerCancel = (event: PointerEvent<HTMLElement>) => {
    const held = drag.current;
    if (!held || event.pointerId !== held.id) return;
    release(held);
    suppressClick.current = true;
    if (!held.live && !held.onThumb) return;
    land(committed.current, null, false, false);
  };

  const handleClick = (event: MouseEvent<HTMLElement>, i: number) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    if (suppressClick.current && event.detail > 0) {
      suppressClick.current = false;
      event.preventDefault();
      return;
    }
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const item = list[i];
    if (item.href && !onChange) return;
    if (item.href) event.preventDefault();
    const from = committed.current;
    if (i === index) {
      if (item.href) onChange?.(item.value, i);
      return;
    }
    commit(i);
    travel(from, i);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>, i: number) => {
    if (disabled) return;
    const last = list.length - 1;
    const start = links ? i : index;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = Math.min(last, start + 1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = Math.max(0, start - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    if (next !== index) {
      commit(next);
      jumpTo(next);
    }
    itemRefs.current[next]?.focus();
  };

  const preset = SIZES[size];
  return (
    <div
      ref={trackRef}
      role={links ? undefined : "radiogroup"}
      aria-label={links ? undefined : ariaLabel}
      aria-disabled={disabled || undefined}
      data-measured={measured ? "" : undefined}
      data-equal={equalSlots ? "" : undefined}
      data-draggable={draggable && !disabled ? "" : undefined}
      className={`rubber-segment${className ? ` ${className}` : ""}`}
      style={
        {
          "--rs-track": trackColor,
          "--rs-thumb": thumbColor,
          "--rs-ink": textColor,
          "--rs-ink-active": activeTextColor,
          "--rs-radius": `${radius}px`,
          "--rs-inset": `${inset}px`,
          "--rs-thumb-radius": `${thumbRadius}px`,
          "--rs-h": `${preset.height}px`,
          "--rs-font": `${preset.font}px`,
          "--rs-pad": `${preset.pad}px`,
          "--rs-min": `${preset.min}px`
        } as CSSProperties
      }
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onLostPointerCapture={handlePointerCancel}
    >
      {list.map((item, i) =>
        item.href ? (
          <a
            key={item.value}
            ref={element => {
              itemRefs.current[i] = element;
            }}
            href={item.href}
            draggable={false}
            aria-current={i === index ? "location" : undefined}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : undefined}
            className="rubber-segment__item"
            onPointerDown={event => handlePointerDown(event, i)}
            onClick={event => handleClick(event, i)}
            onKeyDown={event => handleKeyDown(event, i)}
          >
            {item.icon}
            {item.label}
          </a>
        ) : (
          <button
            key={item.value}
            ref={element => {
              itemRefs.current[i] = element;
            }}
            type="button"
            role="radio"
            aria-checked={i === index}
            tabIndex={i === index ? 0 : -1}
            disabled={disabled}
            className="rubber-segment__item"
            onPointerDown={event => handlePointerDown(event, i)}
            onClick={event => handleClick(event, i)}
            onKeyDown={event => handleKeyDown(event, i)}
          >
            {item.icon}
            {item.label}
          </button>
        )
      )}
      <motion.div
        className="rubber-segment__thumb"
        aria-hidden="true"
        style={{clipPath}}
      >
        {list.map(item => (
          <span
            key={item.value}
            className="rubber-segment__item rubber-segment__copy"
          >
            {item.icon}
            {item.label}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
