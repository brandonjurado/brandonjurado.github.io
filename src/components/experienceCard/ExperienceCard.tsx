import type {Experience} from "../../content/portfolio";
import "./ExperienceCard.scss";

export default function ExperienceCard({cardInfo}: {cardInfo: Experience}) {
  return (
    <div className="experience-card">
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
        <h3 className="experience-text-role">{cardInfo.role}</h3>
        <p className="experience-text-date">{cardInfo.date}</p>
        <p className="subTitle experience-text-desc">{cardInfo.desc}</p>
        <ul>
          {cardInfo.descBullets.map(bullet => (
            <li key={bullet} className="subTitle">
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
