import {skills} from "../../content/skills";
export default function SoftwareSkill() {
  return (
    <ul className="skill-list">
      {skills.map(skill => (
        <li key={skill}>{skill}</li>
      ))}
    </ul>
  );
}
