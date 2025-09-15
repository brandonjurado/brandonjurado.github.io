import React, {useContext, lazy, Suspense} from "react";
import "./Skills.scss";
import SoftwareSkill from "../../components/softwareSkills/SoftwareSkill";
import {illustration, skillsSection} from "../../portfolio";
import {motion as m} from "framer-motion";
import codingPerson from "../../assets/lottie/codingPerson";
import StyleContext from "../../contexts/StyleContext";
import developerSvg from "../../assets/images/developerActivity.svg?url";

// Lazy-load the heavy Lottie component
const DisplayLottie = lazy(() =>
  import("../../components/displayLottie/DisplayLottie")
);

export default function Skills() {
  const {isDark} = useContext(StyleContext);
  if (!skillsSection.display) return null;

  return (
    <div className={isDark ? "dark-mode main" : "main"} id="skills">
      <div className="skills-main-div">
        {/* LEFT */}
        <m.div
          initial={{opacity: 0, y: 18}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.4, ease: "easeOut"}}
          viewport={{once: true, amount: 0.25}}
          style={{willChange: "transform,opacity"}}
        >
          <div className="skills-image-div">
            {illustration.animated ? (
              <Suspense fallback={null}>
                <DisplayLottie animationData={codingPerson} />
              </Suspense>
            ) : (
              <img
                alt="Man Working"
                src={developerSvg}
                width="480"
                height="360"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
        </m.div>

        {/* RIGHT */}
        <m.div
          initial={{opacity: 0, y: 18}}
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
