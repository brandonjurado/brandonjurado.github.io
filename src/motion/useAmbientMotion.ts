import {useEffect, useRef, useState} from "react";
import {motionAllowed} from "./lifecycle";

export function useAmbientMotion() {
  const ref = useRef<HTMLElement>(null);
  const [motion, setMotion] = useState<"paused" | "running" | "static">(
    "paused"
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const preference = matchMedia(
      "(prefers-reduced-motion: reduce), (prefers-reduced-data: reduce)"
    );
    const connection = (
      navigator as Navigator & {
        connection?: EventTarget & {saveData?: boolean};
      }
    ).connection;
    let visible = !("IntersectionObserver" in window);
    const sync = () =>
      setMotion(
        !motionAllowed()
          ? "static"
          : visible && !document.hidden
            ? "running"
            : "paused"
      );
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            sync();
          })
        : undefined;
    observer?.observe(element);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    connection?.addEventListener?.("change", sync);
    sync();
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
      connection?.removeEventListener?.("change", sync);
    };
  }, []);

  return {ref, motion};
}
