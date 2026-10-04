import type {Achievement} from "../../content/portfolio";
import "./AchievementCard.scss";
type Props = {
  cardInfo: Omit<Achievement, "footerLink"> & {
    footer: Achievement["footerLink"];
  };
  isDark: boolean;
};
export default function AchievementCard({cardInfo}: Props) {
  return (
    <article className="certificate-card">
      <div className="certificate-image-div">
        <img
          src={cardInfo.image}
          srcSet={`${cardInfo.image} 256w, ${cardInfo.image.replace("-256", "-512")} 512w`}
          sizes="250px"
          alt={cardInfo.imageAlt}
          className="card-image"
          width="250"
          height="178"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="certificate-detail-div">
        <p className="card-eyebrow">{cardInfo.subtitle}</p>
        <h3 className="card-title">{cardInfo.title}</h3>
        <p className="card-subtitle">{cardInfo.description}</p>
      </div>
      <div className="certificate-card-footer">
        {cardInfo.footer.map(link => (
          <a
            key={link.url}
            className="certificate-tag"
            href={link.url}
            aria-label={`${cardInfo.title}: ${link.name}`}
          >
            {link.name}
          </a>
        ))}
      </div>
    </article>
  );
}
