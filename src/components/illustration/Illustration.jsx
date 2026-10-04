import {useEffect, useRef, useState} from "react";
import landing from "../../assets/lottie/landingPerson.json?url";
import coding from "../../assets/lottie/codingPerson.json?url";
import intro from "../../assets/lottie/splashAnimation.json?url";
import email from "../../assets/lottie/email.json?url";
import "./Illustration.scss";
const artwork = {
  landingPerson: {url: landing, width: 600, height: 600},
  codingPerson: {url: coding, width: 942, height: 704},
  splashAnimation: {url: intro, width: 256, height: 256},
  email: {url: email, width: 1920, height: 1080}
};
export default function Illustration({name, label, eager = false}) {
  const container = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const pauseRequested = useRef(false);
  const player = useRef(undefined);
  const asset = artwork[name];
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const preference = matchMedia(
      "(prefers-reduced-motion: reduce), (prefers-reduced-data: reduce)"
    );
    const connection = navigator.connection;
    const allowed = () => !preference.matches && !connection?.saveData;
    let animation;
    let loading = false;
    let visible = false;
    let disposed = false;
    let idle;
    const controller = new AbortController();
    const sync = () => {
      if (visible && !document.hidden && allowed() && !pauseRequested.current)
        animation?.play();
      else animation?.pause();
    };
    const load = async () => {
      if (loading || !visible || !allowed() || document.hidden || disposed)
        return;
      loading = true;
      try {
        const [module, response] = await Promise.all([
          import("lottie-web/build/player/lottie_light"),
          fetch(asset.url, {signal: controller.signal})
        ]);
        if (!response.ok) throw new Error("Animation unavailable");
        const animationData = await response.json();
        if (disposed || !allowed()) return;
        animation = module.default.loadAnimation({
          container: element,
          renderer: "svg",
          loop: name !== "splashAnimation",
          autoplay: false,
          animationData
        });
        player.current = animation;
        animation.addEventListener("DOMLoaded", () => {
          if (!disposed) {
            setPlaying(true);
            sync();
          }
        });
      } catch {
        /* The original SVG remains visible if playback cannot load. */
      }
    };
    const schedule = () => {
      if (document.readyState !== "complete" || !visible || !allowed()) return;
      if ("requestIdleCallback" in window)
        idle = window.requestIdleCallback(() => {
          void load();
        });
      else void load();
    };
    const update = () => {
      sync();
      schedule();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      {threshold: 0.15}
    );
    observer.observe(element);
    window.addEventListener("load", schedule, {once: true});
    document.addEventListener("visibilitychange", update);
    preference.addEventListener("change", update);
    return () => {
      disposed = true;
      controller.abort();
      observer.disconnect();
      if (idle !== undefined) window.cancelIdleCallback(idle);
      window.removeEventListener("load", schedule);
      document.removeEventListener("visibilitychange", update);
      preference.removeEventListener("change", update);
      animation?.destroy();
      player.current = undefined;
    };
  }, [asset.url, name]);
  return (
    <div
      className="original-illustration"
      style={{aspectRatio: `${asset.width} / ${asset.height}`}}
    >
      <img
        src={`/illustrations/${name}.svg`}
        alt={label}
        width={asset.width}
        height={asset.height}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        className={playing ? "poster is-playing" : "poster"}
      />
      <div ref={container} className="animation" aria-hidden="true" />
      {name !== "splashAnimation" && (
        <button
          type="button"
          className="illustration-control"
          disabled={!playing}
          aria-label={`${paused ? "Play" : "Pause"} ${label.toLowerCase()}`}
          onClick={() => {
            const next = !paused;
            pauseRequested.current = next;
            setPaused(next);
            if (next) player.current?.pause();
            else player.current?.play();
          }}
        >
          {paused ? "Play" : "Pause"}
        </button>
      )}
    </div>
  );
}
