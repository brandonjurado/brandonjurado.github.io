import type {School} from "../../content/portfolio";
import "./EducationCard.scss";

export default function EducationCard({school}: {school: School}) {
  return (
    <div>
      <div className="education-card">
        {school.logo && (
          <div className="education-card-left">
            <img
              className="education-roundedimg"
              src={school.logo}
              alt={school.schoolName}
              width="96"
              height="96"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        <div className="education-card-right">
          <h3 className="education-text-school">{school.schoolName}</h3>
          <div className="education-text-details">
            <h3 className="education-text-subHeader">{school.subHeader}</h3>
            <p className="education-text-duration">{school.duration}</p>
            <p className="education-text-desc">{school.desc}</p>
            <ul>
              {school.descBullets.map(b => (
                <li key={b} className="subTitle">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div
        className="education-card-border"
        style={{transformOrigin: "left"}}
      />
    </div>
  );
}
