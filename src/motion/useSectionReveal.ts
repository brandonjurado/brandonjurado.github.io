import {useEffect, useRef} from "react";
import {motionAllowed} from "./lifecycle";

export function useSectionReveal() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !motionAllowed() || !("IntersectionObserver" in window))
      return;

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("section[id], #contact")
    );
    const animations = new Map<HTMLElement, Animation[]>();
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = entry.target as HTMLElement;
          section.dataset.sectionReveal = "revealed";
          observer.unobserve(section);
          // Animate the contents so section anchors and scroll tracking stay fixed.
          const sequence = Array.from(section.children, child => {
            const animation = child.animate(
              [
                {opacity: 0, transform: "translateY(16px)"},
                {opacity: 1, transform: "none"}
              ],
              {duration: 800, easing: "cubic-bezier(.16,1,.3,1)"}
            );
            animation.id = "section-reveal";
            return animation;
          });
          animations.set(section, sequence);
          void Promise.all(sequence.map(animation => animation.finished))
            .then(() => animations.delete(section))
            .catch(() => {});
        }
      },
      {rootMargin: "0px 0px -12% 0px", threshold: 0.06}
    );

    for (const section of sections) {
      // Keep prerendered and already-visible content readable before setup.
      if (section.getBoundingClientRect().top >= window.innerHeight)
        section.dataset.sectionReveal = "pending";
      observer.observe(section);
    }

    const revealFocus = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      const section = sections.find(section => section.contains(target));
      if (!section) return;
      observer.unobserve(section);
      section.dataset.sectionReveal = "revealed";
      animations.get(section)?.forEach(animation => animation.cancel());
      animations.delete(section);
    };
    const reset = () => {
      observer.disconnect();
      sections.forEach(section =>
        section.removeAttribute("data-section-reveal")
      );
      animations.forEach(sequence =>
        sequence.forEach(animation => animation.cancel())
      );
      animations.clear();
    };
    const query = matchMedia(
      "(prefers-reduced-motion: reduce), (prefers-reduced-data: reduce)"
    );
    const syncPreference = () => {
      if (!motionAllowed()) reset();
    };
    root.addEventListener("focusin", revealFocus);
    query.addEventListener("change", syncPreference);
    window.addEventListener("beforeprint", reset);
    return () => {
      reset();
      root.removeEventListener("focusin", revealFocus);
      query.removeEventListener("change", syncPreference);
      window.removeEventListener("beforeprint", reset);
    };
  }, []);

  return ref;
}
