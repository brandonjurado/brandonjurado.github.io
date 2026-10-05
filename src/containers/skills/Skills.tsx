import Illustration from "../../components/illustration/Illustration";
import "./Skills.scss";
import SoftwareSkill from "../../components/softwareSkills/SoftwareSkill";
import {skillsSection} from "../../content/portfolio";

export default function Skills() {
  if (!skillsSection.display) return null;

  return (
    <div className="main" id="skills">
      <div className="skills-main-div">
        {/* LEFT */}
        <div style={{willChange: "transform,opacity"}}>
          <div className="skills-image-div">
            <Illustration name="codingPerson" label="Man Working" />
          </div>
        </div>

        {/* RIGHT */}
        <div style={{willChange: "transform,opacity"}}>
          <div className="skills-text-div">
            <h2 className="skills-heading">{skillsSection.title}</h2>
            <p className="subTitle skills-text-subtitle">
              {skillsSection.subTitle}
            </p>
            <SoftwareSkill />
            <div>
              {skillsSection.skills.map(skills => (
                <p key={skills} className="subTitle skills-text">
                  {skills}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
