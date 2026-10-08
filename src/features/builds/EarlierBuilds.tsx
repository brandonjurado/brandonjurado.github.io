import SectionHeading from "../../components/sectionHeading/SectionHeading";
import {
  buildsCopy,
  featuredBuilds,
  moreBuilds,
  type EarlierBuild
} from "../../content/builds";
import "./EarlierBuilds.scss";

function BuildLinks({build}: {build: EarlierBuild}) {
  return (
    <ul className="earlier-build-links" role="list">
      {build.links.map(link => (
        <li key={link.url}>
          <a href={link.url} aria-label={`${build.name}: ${link.name}`}>
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function EarlierBuilds() {
  return (
    <section
      className="earlier-builds"
      id="achievements"
      aria-labelledby="builds-heading"
    >
      <SectionHeading
        sectionKey="builds"
        headingId="builds-heading"
        title={buildsCopy.title}
        description={buildsCopy.description}
      />
      <ol className="earlier-builds-list" role="list">
        {featuredBuilds.map(build => (
          <li key={build.name}>
            <details className="earlier-build earlier-build--archived">
              <summary className="earlier-build-heading">
                <h3>{build.name}</h3>
                <p>{build.recognition}</p>
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <div className="earlier-build-body">
                <p className="earlier-build-description">{build.description}</p>
                <p className="earlier-build-technologies">
                  {build.technologies.join(" · ")}
                </p>
                <BuildLinks build={build} />
              </div>
            </details>
          </li>
        ))}
      </ol>
      <details className="more-builds" id="additional-projects">
        <summary>{buildsCopy.moreTitle}</summary>
        <p className="more-builds-introduction">{buildsCopy.moreDescription}</p>
        <ul className="more-builds-list" role="list">
          {moreBuilds.map(build => (
            <li key={build.name}>
              <article className="earlier-build">
                <header className="earlier-build-heading">
                  <h3>{build.name}</h3>
                </header>
                <div className="earlier-build-body">
                  <p className="earlier-build-description">
                    {build.description}
                  </p>
                  <p className="earlier-build-technologies">
                    {build.technologies.join(" · ")}
                  </p>
                  <BuildLinks build={build} />
                </div>
              </article>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
