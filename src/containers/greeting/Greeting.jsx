import React, {useContext} from "react";
import {motion as m} from "framer-motion";
import "./Greeting.scss";
import landingPerson from "../../assets/lottie/landingPerson";
import DisplayLottie from "../../components/displayLottie/DisplayLottie";
import SocialMedia from "../../components/socialMedia/SocialMedia";
import Button from "../../components/button/Button";
import {illustration, greeting, landingMarquee} from "../../portfolio";
import StyleContext from "../../contexts/StyleContext";
import manOnTableSvg from "../../assets/images/manOnTable.svg?url";
import TextType from "../../components/reactBits/TextType/TextType";

export default function Greeting() {
  const {isDark} = useContext(StyleContext);
  const marqueeKeywords = landingMarquee?.keywords ?? [];
  const marqueeBrands = landingMarquee?.brands ?? [];
  const loopItems = items => [...items, ...items];

  if (!greeting.displayGreeting) {
    return null;
  }
  return (
    <m.div
      initial={{opacity: 0, y: 40}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 1}}
      viewport={{once: true, amount: 0.2}}
    >
      <div className="greet-main" id="greeting">
        <div className="greeting-main">
          <div className="greeting-text-div">
            <div>
              <h1
                className={isDark ? "dark-mode greeting-text" : "greeting-text"}
              >
                <TextType
                  text={greeting.title}
                  as="span"
                  loop={false}
                  showCursor={true}
                  cursorCharacter="|"
                  className="greeting-name-type"
                />
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
            {illustration.animated ? (
              <DisplayLottie animationData={landingPerson} />
            ) : (
              <img alt="man sitting on table" src={manOnTableSvg}></img>
            )}
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
    </m.div>
  );
}
