import {traceStages, traceCopy} from "../../content/trace";
import {useEffect, useRef} from "react";
import {motionAllowed} from "../../motion/lifecycle";
import "./RequestTrace.scss";

export default function RequestTrace() {
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = panel.current;
    if (!element) return;
    const preference = matchMedia(
      "(prefers-reduced-motion: reduce), (prefers-reduced-data: reduce)"
    );
    const connection = (
      navigator as Navigator & {
        connection?: EventTarget & {saveData?: boolean};
      }
    ).connection;
    let visible = false;
    const sync = () => {
      element.dataset.motion = !motionAllowed()
        ? "static"
        : visible && !document.hidden
          ? "running"
          : "paused";
    };
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

  return (
    <figure ref={panel} className="request-trace" data-motion="paused">
      <figcaption className="request-trace__heading">
        <span>{traceCopy.title}</span>
        <span className="request-trace__annotation">
          {traceCopy.annotation}
        </span>
      </figcaption>
      <p className="request-trace__description">{traceCopy.description}</p>
      <div className="request-trace__graph" aria-hidden="true">
        <svg
          className="request-trace__connections request-trace__connections--wide"
          viewBox="0 0 480 192"
          preserveAspectRatio="none"
          focusable="false"
        >
          <path d="M80 24H432Q456 24 456 48V112Q456 136 432 136H80" />
          <path
            className="request-trace__direction"
            d="m164 20 4 4-4 4m160-8 4 4-4 4m-156 108-4 4 4 4m156-8-4 4 4 4"
          />
          <circle className="request-trace__packet" cx="80" cy="24" r="3" />
          <circle
            className="request-trace__packet request-trace__packet--following"
            cx="80"
            cy="24"
            r="3"
          />
        </svg>
        <svg
          className="request-trace__connections request-trace__connections--narrow"
          viewBox="0 0 40 320"
          preserveAspectRatio="none"
          focusable="false"
        >
          <path d="M20 20V300" />
          <circle className="request-trace__packet" cx="20" cy="20" r="3" />
          <circle
            className="request-trace__packet request-trace__packet--following"
            cx="20"
            cy="20"
            r="3"
          />
        </svg>
        {traceStages.map(stage => (
          <div
            key={stage.id}
            className={`request-trace__node request-trace__node--${stage.id}`}
          >
            <span className="request-trace__node-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" focusable="false">
                <path d={stage.icon} />
              </svg>
            </span>
            <span className="request-trace__node-label">{stage.label}</span>
          </div>
        ))}
      </div>
      <div className="request-trace__waterfall" aria-hidden="true">
        <div className="request-trace__waterfall-heading">
          <span>{traceCopy.waterfall}</span>
          <span>{traceCopy.direction}</span>
        </div>
        <div className="request-trace__spans">
          {traceStages.slice(1).map(stage => (
            <div className="request-trace__span" key={stage.id}>
              <span className="request-trace__span-label">{stage.label}</span>
              <span className="request-trace__span-track">
                <span className="request-trace__span-segment" />
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="request-trace__note">{traceCopy.note}</p>
    </figure>
  );
}
