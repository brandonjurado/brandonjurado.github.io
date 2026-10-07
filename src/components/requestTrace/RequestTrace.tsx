import {traceStages, traceCopy} from "../../content/trace";
import {useEffect, useId, useRef} from "react";
import {useAmbientMotion} from "../../motion/useAmbientMotion";
import "./RequestTrace.scss";

export default function RequestTrace() {
  const {ref: panel, motion} = useAmbientMotion();
  const id = useId();
  const started = useRef(false);

  useEffect(() => {
    const graphs = panel.current?.querySelectorAll<SVGSVGElement>(
      ".request-trace__connections"
    );
    graphs?.forEach(graph => {
      if (motion === "running") {
        if (!started.current) {
          graph
            .querySelectorAll<SVGAnimationElement>("animateMotion")
            .forEach(animation => animation.beginElement());
        }
        graph.unpauseAnimations();
      } else {
        graph.pauseAnimations();
      }
    });
    if (motion === "running") started.current = true;
  }, [motion, panel]);

  return (
    <figure ref={panel} className="request-trace" data-motion={motion}>
      <figcaption className="request-trace__heading">
        <span>{traceCopy.title}</span>
        <span className="request-trace__annotation">
          {traceCopy.annotation}
        </span>
      </figcaption>
      <p className="request-trace__description">{traceCopy.description}</p>
      <div className="request-trace__graph" aria-hidden="true">
        {[
          {name: "wide", height: 192, top: 24, bottom: 136},
          {name: "compact", height: 152, top: 16, bottom: 104}
        ].map(layout => {
          const pathId = `${id}-${layout.name}`;
          const glowId = `${pathId}-glow`;
          return (
            <svg
              key={layout.name}
              className={`request-trace__connections request-trace__connections--${layout.name}`}
              viewBox={`0 0 480 ${layout.height}`}
              preserveAspectRatio="none"
              focusable="false"
            >
              <defs>
                <radialGradient id={glowId}>
                  <stop
                    offset="0"
                    stopColor="var(--accent)"
                    stopOpacity="0.6"
                  />
                  <stop
                    offset="0.35"
                    stopColor="var(--accent)"
                    stopOpacity="0.3"
                  />
                  <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                </radialGradient>
              </defs>
              <path
                id={pathId}
                className="request-trace__route"
                d={`M80 ${layout.top}H432Q456 ${layout.top} 456 ${layout.top + 24}V${layout.bottom - 24}Q456 ${layout.bottom} 432 ${layout.bottom}H80`}
              />
              <path
                className="request-trace__direction"
                d={`M164 ${layout.top - 4}l4 4-4 4 M324 ${layout.top - 4}l4 4-4 4 M168 ${layout.bottom - 4}l-4 4 4 4 M328 ${layout.bottom - 4}l-4 4 4 4`}
              />
              <g className="request-trace__packet">
                <circle r="12" fill={`url(#${glowId})`} />
                <circle r="3" fill="var(--accent)" />
                <animateMotion
                  begin="indefinite"
                  dur="6s"
                  repeatCount="indefinite"
                >
                  <mpath href={`#${pathId}`} />
                </animateMotion>
              </g>
            </svg>
          );
        })}
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
