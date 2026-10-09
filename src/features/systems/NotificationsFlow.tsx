import {systemDiagramCopy} from "../../content/systems";

export type NotificationPhase =
  | "idle"
  | "processing"
  | "routing"
  | "queued"
  | "sending"
  | "retrying"
  | "delivered";

export const notificationDecision =
  "The queue lets a failed message retry while the order stays accepted.";

export default function NotificationsFlow({
  phase = "idle",
  orderId = ""
}: {
  phase?: NotificationPhase;
  orderId?: string;
}) {
  const copy = systemDiagramCopy.notifications;
  const current = {
    idle: -1,
    processing: 0,
    routing: 1,
    queued: 2,
    sending: 3,
    retrying: 2,
    delivered: 4
  }[phase];

  return (
    <div
      className="system-notifications-diagram notification-demo-flow"
      data-flow-phase={phase}
      aria-hidden="true"
    >
      <div className="system-linear-flow">
        {copy.stages.map((stage, index) => (
          <div className="system-flow-step" data-flow-step={index} key={stage}>
            <div
              className="system-diagram-node"
              data-stage-index={index}
              data-node-state={
                phase === "retrying" && index >= 2
                  ? "retrying"
                  : index < current
                    ? "complete"
                    : index === current
                      ? "active"
                      : "waiting"
              }
            >
              <span>{stage}</span>
              {index === 0 && (
                <code className="notification-event-id">
                  {orderId || "\u00a0"}
                </code>
              )}
            </div>
            {index < copy.stages.length - 1 && (
              <svg
                className="system-flow-arrow system-flow-arrow--next"
                viewBox="0 0 24 24"
                focusable="false"
                data-flow-active={current === index + 1 && phase !== "retrying"}
              >
                <path d="M2 12h19m-6-6 6 6-6 6" />
                <path className="notification-flow-packet" d="M2 12h19" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <svg
        className="system-diagram-connections system-diagram-connections--wide"
        viewBox="0 0 300 48"
        preserveAspectRatio="none"
        focusable="false"
        data-flow-active={phase === "sending"}
      >
        <path d="M262.5 0v16H50v30m212.5-30H150v30m112.5-30H250v30M46 40l4 6 4-6m92 0 4 6 4-6m92 0 4 6 4-6" />
        <path
          className="notification-flow-packet"
          d="M262.5 0v16H150v30"
          pathLength="100"
        />
      </svg>
      <svg
        className="system-diagram-connections system-diagram-connections--narrow"
        viewBox="0 0 300 48"
        preserveAspectRatio="none"
        focusable="false"
        data-flow-active={phase === "sending"}
      >
        <path d="M75 0v16H50v30M75 16h75v30M150 16h100v30M46 40l4 6 4-6m92 0 4 6 4-6m92 0 4 6 4-6" />
        <path
          className="notification-flow-packet"
          d="M75 0v16H150v30"
          pathLength="100"
        />
      </svg>
      <div className="system-notification-channels">
        {copy.channels.map(channel => (
          <div
            className="system-diagram-node"
            key={channel}
            data-node-state={
              channel !== "Email"
                ? "waiting"
                : phase === "delivered"
                  ? "complete"
                  : phase === "sending"
                    ? "active"
                    : phase === "retrying"
                      ? "retrying"
                      : "waiting"
            }
          >
            {channel}
            {channel === "Email" && phase === "delivered" && (
              <svg viewBox="0 0 20 20" focusable="false">
                <path d="m4 10 4 4 8-8" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotificationsPreview() {
  return (
    <div className="notification-demo">
      <div
        className="notification-demo-controls notification-demo-placeholder"
        aria-hidden="true"
      >
        <div className="notification-demo-order">
          <div className="notification-demo-scenarios">
            <span>Direct delivery</span>
            <span>Retry once</span>
          </div>
          <div className="notification-demo-progress" />
        </div>
        <div className="notification-demo-place">
          <div className="notification-demo-loading">Preparing example…</div>
          <p>Drag the handle, or focus it and press Enter.</p>
        </div>
      </div>
      <NotificationsFlow />
      <div className="notification-demo-footer">
        <p className="notification-demo-decision">{notificationDecision}</p>
        <span
          className="notification-demo-reset notification-demo-placeholder"
          aria-hidden="true"
        >
          Reset
        </span>
      </div>
    </div>
  );
}
