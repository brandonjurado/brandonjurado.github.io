import React from "react";
import "./SoftwareSkill.scss";
import {skillsSection} from "../../portfolio";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// Tree-shaking: only imports used icons
import {
  faJava,
  faJs,
  faNode,
  faNpm,
  faAws,
  faDocker,
  faPython,
  faAngular,
  faReact,
  faHtml5,
  faCss3Alt,
  faSass
} from "@fortawesome/free-brands-svg-icons";
import {faDatabase, faFire, faCode} from "@fortawesome/free-solid-svg-icons";
const ICON_MAP = {
  "fab fa-java": faJava,
  "fab fa-js": faJs,
  "fab fa-node": faNode,
  "fab fa-npm": faNpm,
  "fas fa-database": faDatabase,
  "fab fa-aws": faAws,
  "fab fa-docker": faDocker,
  "fab fa-python": faPython,
  "fas fa-fire": faFire,
  "fab fa-angular": faAngular,
  "fab fa-react": faReact,
  "fab fa-html5": faHtml5,
  "fab fa-css3-alt": faCss3Alt,
  "fab fa-sass": faSass
};

export default function SoftwareSkill() {
  return (
    <div className="software-skills-main-div">
      <ul className="dev-icons">
        {skillsSection.softwareSkills.map(
          ({skillName, fontAwesomeClassname}, i) => {
            const icon = ICON_MAP[fontAwesomeClassname] || faCode; // fallback
            return (
              <li
                key={i}
                className="software-skill-inline"
                aria-label={skillName}
                title={skillName}
              >
                <FontAwesomeIcon className="software-skill-icon" icon={icon} />
                <p>{skillName}</p>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
}
