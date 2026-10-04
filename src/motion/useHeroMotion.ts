import {useEffect} from "react";
import {motionAllowed, type MotionHandle} from "./lifecycle";
export function useHeroMotion() {
  useEffect(() => {
    const element = document.getElementById("greeting");
    if (!element || !motionAllowed()) return;
    let disposed = false;
    let visible = false;
    let handle: MotionHandle | undefined;
    const query = matchMedia(
      "(prefers-reduced-motion: reduce), (prefers-reduced-data: reduce)"
    );
    const sync = () => {
      if (!motionAllowed()) {
        handle?.destroy();
        return;
      }
      if (visible && !document.hidden) handle?.init();
      else handle?.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    query.addEventListener("change", sync);
    // A separate feature chunk; no runtime engine and no hidden content.
    void import("./hero").then(module => {
      if (disposed) return;
      handle = module.createHeroMotion(element);
      sync();
    });
    return () => {
      disposed = true;
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      query.removeEventListener("change", sync);
      handle?.destroy();
    };
  }, []);
}
