import {sectionLabel} from "../../content/sections";
import "./Achievement.scss";
import AchievementCard from "../../components/achievementCard/AchievementCard";
import {achievementSection} from "../../content/portfolio";
export default function Achievement() {
  if (!achievementSection.display) {
    return null;
  }
  return (
    <div>
      <div className="main" id="achievements">
        <div className="achievement-main-div">
          <div className="achievement-header">
            <p className="section-eyebrow">{sectionLabel("builds")}</p>
            <h2 className="heading achievement-heading">
              {achievementSection.title}
            </h2>
            <p className="subTitle achievement-subtitle">
              {achievementSection.subtitle}
            </p>
          </div>
          <div className="achievement-cards-div">
            {achievementSection.achievementsCards.map(card => (
              <AchievementCard key={card.title} cardInfo={card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
