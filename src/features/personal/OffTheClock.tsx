import {personalCopy, personalInterests} from "../../content/personal";
import SectionHeading from "../../components/sectionHeading/SectionHeading";
import "./OffTheClock.scss";

export default function OffTheClock() {
  if (!personalCopy.display) return null;

  return (
    <section
      className="off-the-clock"
      id="off-the-clock"
      aria-labelledby="personal-heading"
    >
      <SectionHeading
        sectionKey="personal"
        headingId="personal-heading"
        title={personalCopy.title}
      />
      <ul className="personal-interests" role="list">
        {personalInterests.map(interest => (
          <li key={interest.id}>{interest.label}</li>
        ))}
      </ul>
    </section>
  );
}
