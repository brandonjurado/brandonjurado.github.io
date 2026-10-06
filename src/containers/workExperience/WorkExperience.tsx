import {sectionLabel} from "../../content/sections";
import "./WorkExperience.scss";
import ExperienceCard from "../../components/experienceCard/ExperienceCard";
import {workExperiences} from "../../content/portfolio";

export default function WorkExperience() {
  if (workExperiences.display) {
    return (
      <div id="experience">
        <div className="experience-container" id="workExperience">
          <div>
            <p className="section-eyebrow">{sectionLabel("experience")}</p>
            <h2 className="experience-heading">Experience</h2>
            <div className="experience-cards-div">
              {workExperiences.experience.map(card => (
                <ExperienceCard
                  key={`${card.company}-${card.role}-${card.date}`}
                  cardInfo={card}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
