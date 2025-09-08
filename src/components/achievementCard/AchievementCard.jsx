import React from "react";
import "./AchievementCard.scss";

export default function AchievementCard({cardInfo, isDark}) {
  const {
    title,
    subtitle,
    description,
    image,
    imageAlt,
    footer = []
  } = cardInfo || {};

  function openUrlInNewTab(url, name) {
    if (!url) {
      console.log(`URL for ${name} not found`);
      return;
    }
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (win && win.focus) win.focus();
  }

  const onKeyActivate = (e, url, name) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openUrlInNewTab(url, name);
    }
  };

  return (
    <div className={isDark ? "dark-mode certificate-card" : "certificate-card"}>
      <div className="certificate-image-div">
        {image && (
          <img
            src={image}
            alt={imageAlt || title || "Card Thumbnail"}
            className="card-image"
            width="250"
            height="178"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>

      <div className="certificate-detail-div">
        {subtitle && (
          <div className={isDark ? "dark-mode card-eyebrow" : "card-eyebrow"}>
            {subtitle}
          </div>
        )}

        <h5 className={isDark ? "dark-mode card-title" : "card-title"}>
          {title}
        </h5>

        {description && (
          <p className={isDark ? "dark-mode card-subtitle" : "card-subtitle"}>
            {description}
          </p>
        )}
      </div>

      {footer.length > 0 && (
        <div className="certificate-card-footer">
          {footer.map((v, i) => (
            <span
              key={i}
              role="link"
              tabIndex={0}
              className={
                isDark ? "dark-mode certificate-tag" : "certificate-tag"
              }
              onClick={() => openUrlInNewTab(v.url, v.name)}
              onKeyDown={e => onKeyActivate(e, v.url, v.name)}
              aria-label={v.name}
            >
              {v.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
