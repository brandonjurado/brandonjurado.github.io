import {useEffect, useRef, useState, type CSSProperties} from "react";
import {
  careerCalendar,
  careerRoles,
  experienceCopy,
  monthIndex,
  type CareerRole
} from "../../content/experience";
import SectionHeading from "../../components/sectionHeading/SectionHeading";
import "./CareerTrace.scss";

function CareerRow({role, hydrated}: {role: CareerRole; hydrated: boolean}) {
  const [expanded, setExpanded] = useState(role.endMonth === null);
  const disclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (hydrated) setExpanded(disclosure.current?.open ?? false);
  }, [hydrated]);
  const summaryId = `career-${role.id}`;
  const panelId = `${summaryId}-details`;
  const calendarLength = careerCalendar.endMonth - careerCalendar.startMonth;
  const start = monthIndex(role.startMonth);
  const end = role.endMonth
    ? monthIndex(role.endMonth) + 1
    : careerCalendar.endMonth;
  const spanStyle = {
    "--span-start": `${((start - careerCalendar.startMonth) / calendarLength) * 100}%`,
    "--span-length": `${((end - start) / calendarLength) * 100}%`
  } as CSSProperties;

  return (
    <li className="career-trace__item">
      <details
        ref={disclosure}
        className="career-trace__role"
        open={role.endMonth === null}
        onToggle={event => setExpanded(event.currentTarget.open)}
      >
        <summary
          className="career-trace__summary"
          id={summaryId}
          aria-expanded={hydrated ? expanded : undefined}
          aria-controls={panelId}
        >
          <span className="career-trace__identity">
            <span className="career-trace__company">{role.company}</span>
            <span className="career-trace__title">{role.role}</span>
          </span>
          <span className="career-trace__period">
            <span className="career-trace__date-line">
              <span className="experience-text-date">{role.date}</span>
              {role.endMonth === null && (
                <span className="career-trace__now">
                  {experienceCopy.presentLabel}
                </span>
              )}
            </span>
            <span className="career-trace__track" aria-hidden="true">
              <span className="career-trace__span" style={spanStyle} />
            </span>
          </span>
          <span className="career-trace__disclosure">
            <span>{experienceCopy.detailsLabel}</span>
            <svg
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
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
          {role.contribution && (
            <span className="career-trace__contribution">
              {role.contribution}
            </span>
          )}
        </summary>
        <div
          className="career-trace__details"
          id={panelId}
          role="region"
          aria-labelledby={summaryId}
        >
          <p className="experience-text-desc">{role.desc}</p>
          <p className="career-trace__technology-label">
            {experienceCopy.technologyLabel}
          </p>
          <ul className="career-trace__technologies">
            {role.descBullets.map(technology => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </div>
      </details>
    </li>
  );
}

export default function CareerTrace() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <section
      className="career-trace"
      id="experience"
      aria-labelledby="career-trace-heading"
    >
      <div id="workExperience">
        <SectionHeading
          sectionKey="experience"
          headingId="career-trace-heading"
          title={experienceCopy.title}
          description={experienceCopy.description}
        />
        <div className="career-trace__axis" aria-hidden="true">
          <span>{Math.floor(careerCalendar.startMonth / 12)}</span>
          <span>{experienceCopy.presentLabel}</span>
        </div>
        <ol
          className="career-trace__list"
          aria-label={experienceCopy.rolesLabel}
        >
          {careerRoles.map(role => (
            <CareerRow role={role} hydrated={hydrated} key={role.id} />
          ))}
        </ol>
        <p className="career-trace__overlap-note">
          {experienceCopy.overlapNote}
        </p>
      </div>
    </section>
  );
}
