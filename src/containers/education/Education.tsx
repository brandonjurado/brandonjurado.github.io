import SectionHeading from "../../components/sectionHeading/SectionHeading";
import {education, educationCopy} from "../../content/education";
import "./Education.scss";

export default function Education() {
  return (
    <section
      className="education-section"
      id="education"
      aria-labelledby="education-heading"
    >
      <SectionHeading
        sectionKey="education"
        headingId="education-heading"
        title={educationCopy.title}
      />
      {education.map(school => (
        <article className="education-record" key={school.schoolName}>
          <div>
            <h3>{school.schoolName}</h3>
            <p className="education-degree">{school.subHeader}</p>
            <p className="education-period">{school.duration}</p>
          </div>
          <ul className="education-activities">
            {school.descBullets.map(activity => (
              <li key={activity}>{activity}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
