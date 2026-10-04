import type {MotionHandle} from "./lifecycle";
export function createHeroMotion(element: HTMLElement): MotionHandle {
  let animations: Animation[] = [];
  return {
    init() {
      if (animations.length) {
        animations.forEach(animation => animation.play());
        return;
      }
      const targets = element.querySelectorAll(
        "h1, .greeting-text-subheading, .social-links"
      );
      animations = Array.from(targets, (target, index) =>
        target.animate(
          [{transform: "translateY(6px)"}, {transform: "translateY(0)"}],
          {
            duration: 600,
            delay: index * 80,
            easing: "cubic-bezier(.16,1,.3,1)",
            fill: "none"
          }
        )
      );
    },
    pause() {
      animations.forEach(animation => animation.pause());
    },
    destroy() {
      animations.forEach(animation => animation.cancel());
      animations = [];
    }
  };
}
