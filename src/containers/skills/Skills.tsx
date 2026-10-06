import {capabilities, overview, type Capability} from "../../content/overview";
import "./Skills.scss";

const iconPaths: Record<Capability["id"], readonly string[]> = {
  services: ["m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"],
  data: [
    "M20 5c0 1.66-3.58 3-8 3S4 6.66 4 5s3.58-3 8-3 8 1.34 8 3Z",
    "M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"
  ],
  cloud: [
    "M7 18H5a4 4 0 0 1-.6-7.95 7 7 0 0 1 13.1-2.2A5 5 0 0 1 19 18h-2",
    "M12 12v10m-3-7 3-3 3 3"
  ],
  reliability: ["M2 12h4l3-8 6 16 3-8h4"]
};

export default function Skills() {
  return (
    <section
      className="overview-capabilities"
      id="skills"
      aria-labelledby="capabilities-heading"
    >
      <header className="capabilities-header">
        <h2 id="capabilities-heading">{overview.capabilitiesTitle}</h2>
        <p>{overview.capabilitiesDescription}</p>
      </header>
      <div className="capabilities-grid">
        {capabilities.map(capability => (
          <article className="capability" key={capability.id}>
            <svg
              className="capability-icon"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {iconPaths[capability.id].map(path => (
                <path key={path} d={path} />
              ))}
            </svg>
            <div>
              <h3>{capability.title}</h3>
              <p className="capability-description">{capability.description}</p>
              <p className="capability-technologies">
                {capability.technologies.join(" · ")}
              </p>
            </div>
          </article>
        ))}
      </div>
      <p className="capabilities-fluency">
        <span>{overview.fluencyLabel}</span> {overview.fluent.join(" · ")}
      </p>
    </section>
  );
}
