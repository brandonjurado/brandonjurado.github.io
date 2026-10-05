import {site} from "../../content/site";
import {skills} from "../../content/skills";
import {socialMediaLinks} from "../../content/portfolio";
export default function Metadata({notFound = false}: {notFound?: boolean}) {
  const title = notFound ? "Page not found | Brandon Jurado" : site.title;
  const description = notFound
    ? "This page could not be found. Return to Brandon Jurado’s portfolio."
    : site.description;
  const url = `${site.url}${notFound ? "/404.html" : "/"}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${site.url}/#person`,
        name: site.name,
        jobTitle: site.role,
        url: `${site.url}/`,
        sameAs: [socialMediaLinks.github, socialMediaLinks.linkedin],
        knowsAbout: skills
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: site.title,
        url: `${site.url}/`,
        publisher: {"@id": `${site.url}/#person`}
      }
    ]
  };
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={
          notFound
            ? "noindex, follow"
            : "index, follow, max-image-preview:large"
        }
      />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${site.url}/share-card.png`} />
      <meta property="og:image:alt" content={site.imageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${site.url}/share-card.png`} />
      <meta name="twitter:image:alt" content={site.imageAlt} />
      {!notFound && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c")
          }}
        />
      )}
    </>
  );
}
