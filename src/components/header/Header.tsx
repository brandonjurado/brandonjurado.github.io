import {lazy, Suspense, useEffect, useRef, useState} from "react";
import {site} from "../../content/site";
import {navigation} from "../../content/sections";
import {useAmbientMotion} from "../../motion/useAmbientMotion";
import {motionAllowed} from "../../motion/lifecycle";
import "../rubberSegment/RubberSegment.css";
import "./Header.scss";

const RubberSegment = lazy(() => import("../rubberSegment/RubberSegment"));

const navigationItems = navigation.map(link => ({
  value: link.href,
  href: link.href,
  label: link.label
}));

export default function Header() {
  const {ref, motion} = useAmbientMotion();
  const [current, setCurrent] = useState<string>(navigation[0].href);
  const [enhanced, setEnhanced] = useState(false);
  const scrollDestination = useRef<number | null>(null);

  useEffect(() => {
    const sync = () => {
      scrollDestination.current = null;
      const link = navigation.find(link => link.href === window.location.hash);
      setCurrent(link?.href ?? navigation[0].href);
    };
    sync();
    setEnhanced(true);
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  useEffect(() => {
    const sections = navigation
      .map(link => ({
        href: link.href,
        element: document.getElementById(link.href.slice(1))
      }))
      .reverse();
    let frame = 0;
    const update = () => {
      frame = 0;
      const page = document.documentElement;
      if (scrollDestination.current !== null) {
        if (Math.abs(window.scrollY - scrollDestination.current) > 1) return;
        scrollDestination.current = null;
      }
      const offset = parseFloat(getComputedStyle(page).scrollPaddingTop) || 0;
      const atBottom =
        window.scrollY + window.innerHeight >= page.scrollHeight - 1;
      const active = atBottom
        ? sections[0]
        : sections.find(
            section =>
              section.element &&
              section.element.getBoundingClientRect().top <= offset + 1
          );
      setCurrent(active?.href ?? navigation[0].href);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const resumeTracking = () => {
      scrollDestination.current = null;
      schedule();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
          " "
        ].includes(event.key) &&
        !(
          event.target instanceof HTMLElement &&
          event.target.closest(
            "input, textarea, select, [contenteditable='true']"
          )
        )
      )
        resumeTracking();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target === document.documentElement) resumeTracking();
    };
    schedule();
    window.addEventListener("scroll", schedule, {passive: true});
    window.addEventListener("resize", schedule);
    window.addEventListener("wheel", resumeTracking, {passive: true});
    window.addEventListener("touchmove", resumeTracking, {passive: true});
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("wheel", resumeTracking);
      window.removeEventListener("touchmove", resumeTracking);
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, []);

  const navigate = (href: string) => {
    const target = document.getElementById(href.slice(1));
    const page = document.documentElement;
    const offset = parseFloat(getComputedStyle(page).scrollPaddingTop) || 0;
    scrollDestination.current = target
      ? Math.max(
          0,
          Math.min(
            window.scrollY + target.getBoundingClientRect().top - offset,
            page.scrollHeight - window.innerHeight
          )
        )
      : null;
    setCurrent(href);
    if (window.location.hash !== href) window.history.pushState(null, "", href);
    target?.scrollIntoView({
      behavior: motionAllowed() ? "smooth" : "instant",
      block: "start"
    });
  };

  const fallback = (
    <div className="rubber-segment">
      {navigation.map(link => (
        <a
          key={link.href}
          href={link.href}
          aria-current={current === link.href ? "location" : undefined}
          className="rubber-segment__item"
        >
          {link.label}
        </a>
      ))}
    </div>
  );

  return (
    <header ref={ref} className="header" data-motion={motion}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <a className="header-brand" href="#greeting">
        <span className="header-brand__bracket" aria-hidden="true">
          &lt;
        </span>
        <span className="header-brand__signature">{site.name}</span>
        <span className="header-brand__bracket" aria-hidden="true">
          /&gt;
        </span>
      </a>
      <nav aria-label="Primary" className="navigation">
        {enhanced ? (
          <Suspense fallback={fallback}>
            <RubberSegment
              items={navigationItems}
              value={current}
              onChange={navigate}
              trackColor="var(--nav)"
              thumbColor="var(--accent)"
              textColor="var(--ink)"
              activeTextColor="var(--nav)"
              size="lg"
              radius={100}
              inset={4}
              equalSlots={false}
              draggable
              aria-label="Portfolio sections"
            />
          </Suspense>
        ) : (
          fallback
        )}
      </nav>
      <a className="availability" href="#contact">
        <span className="status-dot" aria-hidden="true" />
        {site.availabilityLabel}
      </a>
    </header>
  );
}
