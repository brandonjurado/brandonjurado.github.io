import "./Footer.scss";
import {
  greeting,
  skillsSection,
  educationInfo,
  workExperiences,
  openSource,
  achievementSection,
  socialMediaLinks,
  footerSection
} from "../../content/portfolio";

export default function Footer() {
  if (footerSection?.display === false) {
    return null;
  }

  const pageLinks = [
    {label: "Home", href: "#greeting", visible: greeting.displayGreeting},
    {label: "Skills", href: "#skills", visible: skillsSection.display},
    {label: "Education", href: "#education", visible: educationInfo.display},
    {
      label: "Experience",
      href: "#experience",
      visible: workExperiences.display
    },
    {label: "Projects", href: "#projects", visible: openSource.display},
    {
      label: "Achievements",
      href: "#achievements",
      visible: achievementSection.display
    },
    {label: "Contact", href: "#contact", visible: true}
  ].filter(link => link.visible);

  const socialLinks = [
    {label: "LinkedIn", href: socialMediaLinks.linkedin},
    {label: "GitHub", href: socialMediaLinks.github},
    {label: "Instagram", href: undefined},
    {label: "YouTube", href: undefined},
    {
      label: "Email",
      href: socialMediaLinks.gmail && `mailto:${socialMediaLinks.gmail}`
    }
  ].filter(link => link.href);

  const brandItems =
    [
      ...new Set((workExperiences.experience || []).map(exp => exp.company))
    ].slice(0, 8) || [];
  const marqueeItems =
    brandItems.length > 0
      ? [...brandItems, ...brandItems]
      : ["H-E-B", "T-Mobile", "USAA", "American Airlines"];

  return (
    <div>
      <div className="footer-div">
        <footer className="footer-shell">
          <div className="footer-shell-glow" aria-hidden="true"></div>
          <div className="footer-content">
            <div className="footer-headline-wrap">
              <p className="footer-eyebrow">Building software that scales.</p>
              <h2 className="footer-statement">
                {footerSection?.statement ||
                  "Always building resilient systems."}
              </h2>
            </div>

            <div className="footer-links-grid">
              <div className="footer-links-col">
                <p className="footer-links-title">Pages</p>
                {pageLinks.map(link => (
                  <a key={link.label} href={link.href} className="footer-link">
                    <span className="footer-link-clip">
                      <span className="footer-link-text">{link.label}</span>
                    </span>
                  </a>
                ))}
              </div>

              <div className="footer-links-col">
                <p className="footer-links-title">Follow On</p>
                {socialLinks.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="footer-link"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="footer-link-clip">
                      <span className="footer-link-text">{link.label}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-brand-marquee" aria-hidden="true">
              <div className="footer-brand-track">
                {marqueeItems.map((brand, index) => (
                  <span className="footer-brand-item" key={`${brand}-${index}`}>
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div className="footer-legal">
              <p className="footer-text">
                Copyright &copy; {__BUILD_YEAR__}.{" "}
                {footerSection?.legalText || "All rights reserved."}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
