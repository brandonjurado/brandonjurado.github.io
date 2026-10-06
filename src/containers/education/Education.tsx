import {sectionLabel} from "../../content/sections";
import "./Education.scss";
import EducationCard from "../../components/educationCard/EducationCard";
import {educationInfo} from "../../content/portfolio";

export default function Education() {
  if (educationInfo.display) {
    return (
      <div className="education-section" id="education">
        <p className="section-eyebrow">{sectionLabel("education")}</p>
        <h2 className="education-heading">Education</h2>
        <div className="education-card-container">
          {educationInfo.schools.map(school => (
            <EducationCard key={school.schoolName} school={school} />
          ))}
        </div>
      </div>
    );
  }
  return null;
}
