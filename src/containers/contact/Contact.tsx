import Illustration from "../../components/illustration/Illustration";
import "./Contact.scss";
import SocialMedia from "../../components/socialMedia/SocialMedia";
import {contactInfo} from "../../content/portfolio";

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
              <SocialMedia />
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
