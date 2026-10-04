import Illustration from "../../components/illustration/Illustration";
import React, {useContext} from "react";
import "./Greeting.scss";
import SocialMedia from "../../components/socialMedia/SocialMedia";
import Button from "../../components/button/Button";
import {greeting, landingMarquee} from "../../portfolio";
import StyleContext from "../../contexts/StyleContext";

export default function Greeting() {
  const {isDark} = useContext(StyleContext);
  const marqueeKeywords = landingMarquee?.keywords ?? [];
  const marqueeBrands = landingMarquee?.brands ?? [];
  const loopItems = items => [...items, ...items];

  if (!greeting.displayGreeting) {
    return null;
  }
  return (
    <div>
      <div className="greet-main" id="greeting">
        <div className="greeting-main">
          <div className="greeting-text-div">
            <div>
              <h1
                className={isDark ? "dark-mode greeting-text" : "greeting-text"}
              >
                <span className="greeting-name-type">{greeting.title}</span>
              </h1>
              <p
                className={
                  isDark
                    ? "dark-mode greeting-text-subheading"
                    : "greeting-text-subheading subTitle"
                }
              >
                <span className="location">{greeting.location}</span>
              </p>
              <p
                className={
                  isDark
                    ? "dark-mode greeting-text-p"
                    : "greeting-text-p subTitle"
                }
              >
                {greeting.subTitle}
              </p>
              <SocialMedia />
              <div className="button-greeting-div">
                <Button text="Contact me" href="#contact" />
                {greeting.resumeLink && (
                  <a
                    href={require("./resume.pdf")}
                    download="Resume.pdf"
                    className="download-link-button"
                  >
                    <Button text="Download my resume" />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="greeting-image-div">
            <Illustration
              name="landingPerson"
              label="Original waving character"
              eager
            />
            <div className="intro-illustration">
              <Illustration
                name="splashAnimation"
                label="Original intro animation"
                eager
              />
            </div>
          </div>
        </div>
        {landingMarquee?.display &&
          (marqueeKeywords.length > 0 || marqueeBrands.length > 0) && (
            <div
              className={isDark ? "landing-marquee is-dark" : "landing-marquee"}
              aria-label="Scrolling keywords and brands"
            >
              {marqueeKeywords.length > 0 && (
                <div className="landing-marquee-row is-keywords">
                  <div className="landing-marquee-track" aria-hidden="true">
                    {loopItems(marqueeKeywords).map((item, index) => (
                      <span
                        className="landing-marquee-item"
                        key={`${item}-${index}`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {marqueeBrands.length > 0 && (
                <div className="landing-marquee-row is-brands">
                  <div className="landing-marquee-track" aria-hidden="true">
                    {loopItems(marqueeBrands).map((item, index) => (
                      <span
                        className="landing-marquee-item"
                        key={`${item}-${index}`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
