import {capabilities, overview} from "../../content/overview";
import "./Skills.scss";

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
