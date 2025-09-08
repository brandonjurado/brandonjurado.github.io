import React, {useContext} from "react";
import "./AdditionalProjects.scss";
import {additionalProjects} from "../../portfolio";
import StyleContext from "../../contexts/StyleContext";
import {motion as m} from "framer-motion";

export default function AdditionalProjects() {
  const {isDark} = useContext(StyleContext);
  if (!additionalProjects?.display) return null;

  return (
    <m.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 1}}
      viewport={{once: true, amount: 0.2}}
    >
      <section className="main" id="additional-projects">
        <div className="additional-header">
          <h2 className={isDark ? "dark-mode heading" : "heading"}>
            {additionalProjects.title}
          </h2>
          {additionalProjects.subtitle && (
            <p
              className={
                isDark
                  ? "dark-mode subTitle additional-subtitle"
                  : "subTitle additional-subtitle"
              }
            >
              {additionalProjects.subtitle}
            </p>
          )}
        </div>

        <div className="ap-grid">
          {additionalProjects.items.map((p, i) => (
            <article
              key={i}
              className={isDark ? "dark-mode ap-card" : "ap-card"}
            >
              <div className="ap-header">
                <h3 className="ap-name">{p.name}</h3>
                {p.description && (
                  <p className={isDark ? "dark-mode ap-desc" : "ap-desc"}>
                    {p.description}
                  </p>
                )}
              </div>

              {p.tech?.length ? (
                <div className="ap-tags">
                  {p.tech.map((t, j) => (
                    <span className="ap-tag" key={j}>
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              {p.links?.length ? (
                <div className="ap-links">
                  {p.links.map((l, j) => (
                    <a
                      key={j}
                      className="ap-link"
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {l.name}
                    </a>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </m.div>
  );
}
