import {useContext} from "react";
import {motion as m} from "framer-motion";
import "./EducationCard.scss";
import StyleContext from "../../contexts/StyleContext";

export default function EducationCard({school}) {
  const {isDark} = useContext(StyleContext);

  const item = {
    hidden: {opacity: 0, x: -24},
    show: {opacity: 1, x: 0, transition: {duration: 1, ease: "easeOut"}}
  };

  return (
    <div>
      <m.div
        className="education-card"
        variants={item}
        initial="hidden"
        whileInView="show"
        viewport={{amount: 0.3, once: true}}
      >
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
          <h5 className="education-text-school">{school.schoolName}</h5>
          <div className="education-text-details">
            <h5
              className={
                isDark
                  ? "dark-mode education-text-subHeader"
                  : "education-text-subHeader"
              }
            >
              {school.subHeader}
            </h5>
            <p
              className={`${isDark ? "dark-mode" : ""} education-text-duration`}
            >
              {school.duration}
            </p>
            <p className="education-text-desc">{school.desc}</p>
            <ul>
              {(school.descBullets || []).map((b, i) => (
                <li key={i} className="subTitle">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </m.div>
      <m.div
        className="education-card-border"
        initial={{scaleX: 0}}
        whileInView={{scaleX: 1}}
        viewport={{once: true}}
        transition={{duration: 2.0, ease: "easeOut"}}
        style={{transformOrigin: "left"}}
      />
    </div>
  );
}
