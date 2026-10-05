import "./AdditionalProjects.scss";
import {additionalProjects} from "../../content/portfolio";

export default function AdditionalProjects() {
  if (!additionalProjects?.display) return null;

  return (
    <div>
      <section className="main" id="additional-projects">
        <div className="additional-header">
          <h2 className="heading">{additionalProjects.title}</h2>
          {additionalProjects.subtitle && (
            <p className="subTitle additional-subtitle">
              {additionalProjects.subtitle}
            </p>
          )}
        </div>

        <div className="ap-grid">
          {additionalProjects.items.map(p => (
            <article key={p.name} className="ap-card">
              <div className="ap-header">
                <h3 className="ap-name">{p.name}</h3>
                {p.description && <p className="ap-desc">{p.description}</p>}
              </div>

              {p.tech?.length ? (
                <div className="ap-tags">
                  {p.tech.map(t => (
                    <span className="ap-tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              {p.links?.length ? (
                <div className="ap-links">
                  {p.links.map(l => (
                    <a
                      key={l.url}
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
    </div>
  );
}
