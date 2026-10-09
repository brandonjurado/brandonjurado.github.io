import Illustration from "../../components/illustration/Illustration";
import "./Contact.scss";
import Icon from "../../components/icon/Icon";
import {contactInfo, socialMediaLinks} from "../../content/portfolio";

export default function Contact() {
  return (
    <div>
      <div className="main contact-margin-top" id="contact">
        <div className="contact-div-main">
          <div className="contact-header">
            <h2 className="heading contact-title">{contactInfo.title}</h2>
            <p className="subTitle contact-subtitle">{contactInfo.subtitle}</p>
            <div className="contact-text-div">
              {contactInfo.number && (
                <>
                  <a
                    className="contact-detail"
                    href={"tel:" + contactInfo.number}
                  >
                    {contactInfo.number}
                  </a>
                  <br />
                  <br />
                </>
              )}
              <div className="contact-email">
                <a
                  className="contact-email-action"
                  href={`mailto:${contactInfo.email_address}`}
                >
                  <Icon name="email" />
                  Email Brandon
                </a>
                <a
                  className="contact-email-address"
                  href={`mailto:${contactInfo.email_address}`}
                >
                  {contactInfo.email_address}
                </a>
              </div>
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
          </div>
          <div className="contact-image-div">
            <Illustration name="email" label="Contact illustration" />
          </div>
        </div>
      </div>
    </div>
  );
}
