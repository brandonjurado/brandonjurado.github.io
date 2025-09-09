import React from "react";
import "./SocialMedia.scss";
import {socialMediaLinks} from "../../portfolio";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faFacebook,
  faGitlab,
  faMedium,
  faInstagram,
  faStackOverflow
} from "@fortawesome/free-brands-svg-icons";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import "@/icons/fa";

export default function socialMedia() {
  if (!socialMediaLinks.display) {
    return null;
  }
  return (
    <div className="social-media-div">
      {socialMediaLinks.github ? (
        <a
          href={socialMediaLinks.github}
          className="icon-button github"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Github"
        >
          <FontAwesomeIcon icon={faGithub} className="icon" />
        </a>
      ) : null}

      {socialMediaLinks.linkedin ? (
        <a
          href={socialMediaLinks.linkedin}
          className="icon-button linkedin"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FontAwesomeIcon icon={faLinkedin} className="icon" />
        </a>
      ) : null}

      {socialMediaLinks.gmail ? (
        <a
          href={`mailto:${socialMediaLinks.gmail}`}
          className="icon-button google"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Gmail"
        >
          <FontAwesomeIcon icon={faEnvelope} className="icon" />
        </a>
      ) : null}

      {socialMediaLinks.gitlab ? (
        <a
          href={socialMediaLinks.gitlab}
          className="icon-button gitlab"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Gitlab"
        >
          <FontAwesomeIcon icon={faGitlab} className="icon" />
        </a>
      ) : null}

      {socialMediaLinks.facebook ? (
        <a
          href={socialMediaLinks.facebook}
          className="icon-button facebook"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FontAwesomeIcon icon={faFacebook} className="icon" />
        </a>
      ) : null}

      {socialMediaLinks.instagram ? (
        <a
          href={socialMediaLinks.instagram}
          className="icon-button instagram"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FontAwesomeIcon icon={faInstagram} className="icon" />
        </a>
      ) : null}

      {socialMediaLinks.twitter ? (
        <a
          href={socialMediaLinks.twitter}
          className="icon-button twitter"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <FontAwesomeIcon icon={faGithub} className="icon" />
        </a>
      ) : null}

      {socialMediaLinks.medium ? (
        <a
          href={socialMediaLinks.medium}
          className="icon-button medium"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Medium"
        >
          <FontAwesomeIcon icon={faMedium} className="icon" />
        </a>
      ) : null}

      {socialMediaLinks.stackoverflow ? (
        <a
          href={socialMediaLinks.stackoverflow}
          className="icon-button stack-overflow"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Stack Overflow"
        >
          <FontAwesomeIcon icon={faStackOverflow} className="icon" />
        </a>
      ) : null}
    </div>
  );
}
