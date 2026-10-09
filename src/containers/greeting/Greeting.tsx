import RequestTrace from "../../components/requestTrace/RequestTrace";
import {overview} from "../../content/overview";
import "./Greeting.scss";

export default function Greeting() {
  return (
    <section
      className="overview-hero"
      id="greeting"
      aria-labelledby="overview-heading"
    >
      <div className="overview-hero-layout">
        <div className="overview-copy">
          <div className="overview-identity">
            <p className="overview-name">{overview.name}</p>
            <p className="overview-role">
              {overview.role} <span aria-hidden="true">/</span>{" "}
              {overview.location}
            </p>
          </div>
          <h1 className="overview-headline" id="overview-heading">
            {overview.headline.map(line => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="overview-description">{overview.description}</p>
          <div className="overview-actions">
            <a
              className="overview-action overview-action-primary"
              href="#contact"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 5h18v14H3zM3 5l9 7 9-7" />
              </svg>
              {overview.contactLabel}
            </a>
            <a className="overview-action" href="#experience">
              {overview.experienceLabel}
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14m-5-5 5 5-5 5" />
              </svg>
            </a>
          </div>
          <div className="overview-proof" aria-label={overview.proofLabel}>
            <p>{overview.proofLabel}</p>
            <ul>
              {overview.employers.map(employer => (
                <li key={employer}>{employer}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="overview-trace">
          <RequestTrace />
        </div>
      </div>
      <div className="overview-context">
        <h2>{overview.personalTitle}</h2>
        <p>{overview.personalDescription}</p>
      </div>
    </section>
  );
}
