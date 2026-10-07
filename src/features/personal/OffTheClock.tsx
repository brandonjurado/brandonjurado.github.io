import {personalCopy, personalInterests} from "../../content/personal";
import SectionHeading from "../../components/sectionHeading/SectionHeading";
import "./OffTheClock.scss";

export default function OffTheClock() {
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
      <div className="personal-photos">
        {personalInterests.map(interest => (
          <figure
            className={`personal-photo personal-photo--${interest.id}`}
            key={interest.id}
          >
            <div className="personal-photo-placeholder">
              <span>{personalCopy.photoStatus}</span>
            </div>
            <figcaption>{interest.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
