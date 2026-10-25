import SectionHeading from "../../components/sectionHeading/SectionHeading";
import "./Contact.scss";
import Icon from "../../components/icon/Icon";
import {contactInfo, socialMediaLinks} from "../../content/portfolio";

export default function Contact() {
  return (
    <section className="main" id="contact" aria-labelledby="contact-heading">
      <SectionHeading
        sectionKey="contact"
        headingId="contact-heading"
        title={contactInfo.title}
        description={contactInfo.subtitle}
      />
      <div className="contact-actions">
        {contactInfo.number && (
          <a className="contact-detail" href={`tel:${contactInfo.number}`}>
            {contactInfo.number}
          </a>
        )}
        <a
          className="contact-email-action"
          href={`mailto:${contactInfo.email_address}`}
        >
          <Icon name="email" />
          Email Brandon
        </a>
        {socialMediaLinks.display && (
          <div className="contact-profiles">
            <a
              href={socialMediaLinks.github}
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="github" />
            </a>
            <a
              href={socialMediaLinks.linkedin}
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="linkedin" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
