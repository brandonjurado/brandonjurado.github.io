import type {Experience} from "../../content/portfolio";
import React from "react";
import "./ExperienceCard.scss";

export default function ExperienceCard({
  cardInfo,
  isDark
}: {
  cardInfo: Experience;
  isDark: boolean;
}) {
  const GetDescBullets = ({
    descBullets,
    isDark
  }: {
    descBullets: string[];
    isDark: boolean;
  }) => {
    return descBullets
      ? descBullets.map((item, i) => (
          <li
            key={i}
            className={isDark ? "subTitle dark-mode-text" : "subTitle"}
          >
            {item}
          </li>
        ))
      : null;
  };

  return (
    <div className={isDark ? "experience-card-dark" : "experience-card"}>
      <div
        style={
          cardInfo.accentColor ? {background: cardInfo.accentColor} : undefined
        }
        className="experience-banner"
      >
        <div className="experience-blurred_div"></div>
        <div className="experience-div-company">
          <h3 className="experience-text-company">{cardInfo.company}</h3>
        </div>

        <img
          className="experience-roundedimg"
          src={cardInfo.companylogo}
          srcSet={`${cardInfo.companylogo.replace("-256", "-128")} 128w, ${cardInfo.companylogo} ${["T-Mobile", "USAA", "American Airlines"].includes(cardInfo.company) ? 200 : 256}w`}
          sizes="128px"
          alt={cardInfo.company}
          width="128"
          height="128"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="experience-text-details">
        <h3
          className={
            isDark
              ? "experience-text-role dark-mode-text"
              : "experience-text-role"
          }
        >
          {cardInfo.role}
        </h3>
        <p
          className={
            isDark
              ? "experience-text-date dark-mode-text"
              : "experience-text-date"
          }
        >
          {cardInfo.date}
        </p>
        <p
          className={
            isDark
              ? "subTitle experience-text-desc dark-mode-text"
              : "subTitle experience-text-desc"
          }
        >
          {cardInfo.desc}
        </p>
        <ul>
          <GetDescBullets descBullets={cardInfo.descBullets} isDark={isDark} />
        </ul>
      </div>
    </div>
  );
}
