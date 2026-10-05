import {skillsSection} from "../../content/portfolio";
import Icon, {type IconName} from "../icon/Icon";
import "./SoftwareSkill.scss";
const icons: Record<string, IconName> = {
  "fab fa-java": "java",
  "fab fa-js": "js",
  "fab fa-node": "node",
  "fab fa-npm": "npm",
  "fas fa-database": "database",
  "fab fa-aws": "aws",
  "fab fa-docker": "docker",
  "fab fa-python": "python",
  "fas fa-fire": "fire",
  "fab fa-angular": "angular",
  "fab fa-react": "react",
  "fab fa-html5": "html5",
  "fab fa-css3-alt": "css3Alt",
  "fab fa-sass": "sass"
};
export default function SoftwareSkill() {
  return (
    <div className="software-skills-main-div">
      <ul className="dev-icons">
        {skillsSection.softwareSkills.map(
          ({skillName, fontAwesomeClassname}) => (
            <li
              key={skillName}
              className="software-skill-inline"
              title={skillName}
            >
              <Icon
                className="software-skill-icon"
                name={icons[fontAwesomeClassname] ?? "code"}
              />
              <p>{skillName}</p>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
