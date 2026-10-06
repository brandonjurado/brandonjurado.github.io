import {site} from "../../content/site";
import {navigation} from "../../content/sections";
import {socialMediaLinks} from "../../content/portfolio";
import "./Footer.scss";
export default function Footer() {
  return (
    <footer className="footer-shell">
      <div className="footer-inner">
        <div className="footer-topline">
          <a className="footer-name" href="#greeting">
            {site.name}
          </a>
          <p>
            {site.footerRole} · {site.location}
          </p>
        </div>
        <div className="footer-links">
          <nav aria-label="Footer">
            {navigation.map(link => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <a href="/sitemap.xml">{site.sitemapLabel}</a>
          </nav>
          <div className="footer-social">
            <a
              href={socialMediaLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              {site.linkedinLabel}
            </a>
            <a
              href={socialMediaLinks.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              {site.githubLabel}
            </a>
            <a href={`mailto:${socialMediaLinks.gmail}`}>{site.contactLabel}</a>
          </div>
        </div>
        <svg
          className="footer-wordmark"
          viewBox="0 0 1280 180"
          aria-hidden="true"
          focusable="false"
        >
          <text x="0" y="140" textLength="1280" lengthAdjust="spacingAndGlyphs">
            {site.name}
          </text>
        </svg>
        <p className="footer-copyright">
          © {__BUILD_YEAR__} {site.name}
        </p>
      </div>
    </footer>
  );
}
