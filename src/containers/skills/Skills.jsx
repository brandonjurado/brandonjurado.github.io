import Illustration from "../../components/illustration/Illustration";
import React, {useContext} from "react";
import "./Skills.scss";
import SoftwareSkill from "../../components/softwareSkills/SoftwareSkill";
import {skillsSection} from "../../portfolio";
import {motion as m} from "framer-motion";
import StyleContext from "../../contexts/StyleContext";

// Lazy-load the heavy Lottie component

export default function Skills() {
  const {isDark} = useContext(StyleContext);
  if (!skillsSection.display) return null;

  return (
    <div className={isDark ? "dark-mode main" : "main"} id="skills">
      <div className="skills-main-div">
        {/* LEFT */}
        <m.div
          initial={false}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.4, ease: "easeOut"}}
          viewport={{once: true, amount: 0.25}}
          style={{willChange: "transform,opacity"}}
        >
          <div className="skills-image-div">
            <Illustration name="codingPerson" label="Man Working" />
          </div>
        </m.div>

        {/* RIGHT */}
        <m.div
          initial={false}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.4, ease: "easeOut"}}
          viewport={{once: true, amount: 0.25}}
          style={{willChange: "transform,opacity"}}
        >
          <div className="skills-text-div">
            <h1
              className={isDark ? "dark-mode skills-heading" : "skills-heading"}
            >
              {skillsSection.title}
            </h1>
            <p
              className={
                isDark
                  ? "dark-mode subTitle skills-text-subtitle"
                  : "subTitle skills-text-subtitle"
              }
            >
              {skillsSection.subTitle}
            </p>
            <SoftwareSkill />
            <div>
              {skillsSection.skills.map((skills, i) => (
                <p
                  key={i}
                  className={
                    isDark
                      ? "dark-mode subTitle skills-text"
                      : "subTitle skills-text"
                  }
                >
                  {skills}
                </p>
              ))}
            </div>
          </div>
        </m.div>
      </div>
    </div>
  );
}
