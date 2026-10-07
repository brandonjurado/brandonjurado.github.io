import {useEffect, useRef, useState, type KeyboardEvent} from "react";
import {
  selectedSystems,
  systemDiagramCopy,
  systemsCopy,
  type SelectedSystem,
  type SystemId
} from "../../content/systems";
import SectionHeading from "../../components/sectionHeading/SectionHeading";
import "./SelectedSystems.scss";

function FlowArrow({className = ""}: {className?: string}) {
  return (
    <svg
      className={`system-flow-arrow ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 12h19m-6-6 6 6-6 6" />
    </svg>
  );
}

function DiagramNode({label}: {label: string}) {
  return <div className="system-diagram-node">{label}</div>;
}

function LinearFlow({stages}: {stages: readonly string[]}) {
  return (
    <div className={`system-linear-flow system-linear-flow--${stages.length}`}>
      {stages.map((stage, index) => (
        <div className="system-flow-step" key={stage}>
          <DiagramNode label={stage} />
          {index < stages.length - 1 && (
            <FlowArrow className="system-flow-arrow--next" />
          )}
        </div>
      ))}
    </div>
  );
}

function NotificationsDiagram() {
  const copy = systemDiagramCopy.notifications;
  return (
    <div className="system-notifications-diagram">
      <LinearFlow stages={copy.stages} />
      <svg
        className="system-diagram-connections system-diagram-connections--wide"
        viewBox="0 0 300 48"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M262.5 0v16H50v30m212.5-30H150v30m112.5-30H250v30M46 40l4 6 4-6m92 0 4 6 4-6m92 0 4 6 4-6" />
      </svg>
      <svg
        className="system-diagram-connections system-diagram-connections--narrow"
        viewBox="0 0 300 48"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M150 0v16H50v30m100-30v30m0-30h100v30M46 40l4 6 4-6m92 0 4 6 4-6m92 0 4 6 4-6" />
      </svg>
      <div className="system-notification-channels">
        {copy.channels.map(channel => (
          <DiagramNode key={channel} label={channel} />
        ))}
      </div>
    </div>
  );
}

function IdentityDiagram() {
  const copy = systemDiagramCopy.identity;
  return (
    <div className="system-identity-diagram">
      <div className="system-identity-side">
        {copy.inputs.map(input => (
          <DiagramNode key={input} label={input} />
        ))}
      </div>
      <svg
        className="system-diagram-connections system-identity-connections system-diagram-connections--wide"
        viewBox="0 0 40 176"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M0 36h20v52h18M0 140h20V88m12-6 6 6-6 6" />
      </svg>
      <svg
        className="system-diagram-connections system-identity-connections system-diagram-connections--narrow"
        viewBox="0 0 300 40"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M75 0v16h150V0M150 16v22m-5-6 5 6 5-6" />
      </svg>
      <DiagramNode label={copy.center} />
      <svg
        className="system-diagram-connections system-identity-connections system-diagram-connections--wide"
        viewBox="0 0 40 176"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M0 88h20V36h18M20 88v52h18m-6-110 6 6-6 6m0 92 6 6-6 6" />
      </svg>
      <svg
        className="system-diagram-connections system-identity-connections system-diagram-connections--narrow"
        viewBox="0 0 300 40"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M150 0v16H75v22m75-22h75v22M70 32l5 6 5-6m140 0 5 6 5-6" />
      </svg>
      <div className="system-identity-side">
        {copy.outputs.map(output => (
          <DiagramNode key={output} label={output} />
        ))}
      </div>
    </div>
  );
}

function BookingDiagram() {
  const copy = systemDiagramCopy.booking;
  return (
    <div className="system-booking-diagram">
      <div className="system-booking-origin">
        <p className="system-diagram-scope">{copy.originLabel}</p>
        <DiagramNode label={copy.origin} />
      </div>
      <div className="system-booking-migration">
        <span>{copy.migration}</span>
        <FlowArrow />
      </div>
      <div className="system-booking-destination">
        <p className="system-diagram-scope">{copy.destinationLabel}</p>
        <LinearFlow stages={copy.stages} />
      </div>
    </div>
  );
}

function SystemDiagram({system}: {system: SelectedSystem}) {
  const diagram = {
    notifications: <NotificationsDiagram />,
    identity: <IdentityDiagram />,
    billing: <LinearFlow stages={systemDiagramCopy.billing.stages} />,
    booking: <BookingDiagram />
  }[system.id];

  return (
    <figure
      className="selected-system-diagram"
      aria-labelledby={`system-diagram-title-${system.id}`}
      aria-describedby={`system-diagram-description-${system.id}`}
    >
      <figcaption>
        <span id={`system-diagram-title-${system.id}`}>
          {system.diagramTitle}
        </span>
        <span className="system-diagram-annotation">
          {systemsCopy.diagramLabel}
        </span>
      </figcaption>
      <p
        className="system-diagram-description"
        id={`system-diagram-description-${system.id}`}
      >
        {system.diagramDescription}
      </p>
      <div className="system-diagram-graph" aria-hidden="true">
        {diagram}
      </div>
      <p className="system-diagram-note">{systemsCopy.diagramNote}</p>
    </figure>
  );
}

export default function SelectedSystems() {
  const [activeSystem, setActiveSystem] = useState<SystemId>("notifications");
  const tabButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const tabScroller = useRef<HTMLDivElement>(null);

  function updateScrollEdges() {
    const scroller = tabScroller.current;
    if (!scroller) return;
    scroller.dataset.scrollStart = String(scroller.scrollLeft > 1);
    scroller.dataset.scrollEnd = String(
      scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1
    );
  }

  useEffect(() => {
    const scroller = tabScroller.current;
    if (!scroller) return;
    updateScrollEdges();
    const observer = new ResizeObserver(updateScrollEdges);
    observer.observe(scroller);
    tabButtons.current.forEach(button => {
      if (button) observer.observe(button);
    });
    return () => observer.disconnect();
  }, []);

  function selectTab(index: number, moveFocus = false) {
    setActiveSystem(selectedSystems[index].id);
    const button = tabButtons.current[index];
    const scroller = tabScroller.current;
    if (!button || !scroller) return;
    if (moveFocus) button.focus({preventScroll: true});
    scroller.scrollTo({
      left: button.offsetLeft - (scroller.clientWidth - button.offsetWidth) / 2,
      behavior: "instant"
    });
    updateScrollEdges();
  }

  function handleTabKey(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % selectedSystems.length;
        break;
      case "ArrowLeft":
        nextIndex =
          (index - 1 + selectedSystems.length) % selectedSystems.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = selectedSystems.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    selectTab(nextIndex, true);
  }

  return (
    <section
      className="selected-systems"
      id="systems"
      aria-labelledby="systems-heading"
    >
      <SectionHeading
        sectionKey="systems"
        headingId="systems-heading"
        title={systemsCopy.title}
        description={systemsCopy.introduction}
      />
      <div className="selected-systems-tab-controls">
        <div
          className="selected-systems-tabs"
          role="tablist"
          aria-label={systemsCopy.tabsLabel}
          ref={tabScroller}
          onScroll={updateScrollEdges}
        >
          {selectedSystems.map((system, index) => (
            <button
              type="button"
              role="tab"
              id={`system-tab-${system.id}`}
              key={system.id}
              aria-selected={activeSystem === system.id}
              aria-controls={`system-panel-${system.id}`}
              tabIndex={activeSystem === system.id ? 0 : -1}
              ref={button => {
                tabButtons.current[index] = button;
              }}
              onClick={() => selectTab(index)}
              onKeyDown={event => handleTabKey(event, index)}
            >
              {system.label}
            </button>
          ))}
        </div>
      </div>
      {selectedSystems.map(system => (
        <div
          className="selected-system-panel"
          role="tabpanel"
          id={`system-panel-${system.id}`}
          key={system.id}
          aria-labelledby={`system-tab-${system.id}`}
          hidden={activeSystem !== system.id}
          tabIndex={0}
        >
          <div className="selected-system-copy">
            <h3>{system.title}</h3>
            <p>{system.summary}</p>
            <dl className="selected-system-tools">
              <dt>{systemsCopy.toolsLabel}</dt>
              <dd>
                <ul role="list">
                  {system.technologies.map(technology => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </dd>
            </dl>
          </div>
          <SystemDiagram system={system} />
        </div>
      ))}
    </section>
  );
}
