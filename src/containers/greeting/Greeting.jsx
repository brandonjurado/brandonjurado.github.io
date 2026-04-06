import React, {lazy, Suspense, useContext} from "react";
import "./Greeting.scss";
import landingPerson from "../../assets/lottie/landingPerson";
import SocialMedia from "../../components/socialMedia/SocialMedia";
import Button from "../../components/button/Button";
import {illustration, greeting, landingMarquee} from "../../portfolio";
import StyleContext from "../../contexts/StyleContext";
import manOnTableSvg from "../../assets/images/manOnTable.svg?url";
import {usePrefersReducedMotion} from "../../hooks/usePrefersReducedMotion";

const DisplayLottie = lazy(
  () => import("../../components/displayLottie/DisplayLottie")
);
const TextType = lazy(
  () => import("../../components/reactBits/TextType/TextType")
);

export default function Greeting() {
  const {isDark} = useContext(StyleContext);
  const prefersReducedMotion = usePrefersReducedMotion();
  const marqueeKeywords = landingMarquee?.keywords ?? [];
  const marqueeBrands = landingMarquee?.brands ?? [];
  const loopItems = items => [...items, ...items];
  const shouldAnimateIllustration =
    illustration.animated && !prefersReducedMotion;

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
                <Suspense
                  fallback={
                    <span className="greeting-name-type">{greeting.title}</span>
                  }
                >
                  <TextType
                    text={greeting.title}
                    as="span"
                    loop={false}
                    showCursor={true}
                    cursorCharacter="|"
                    className="greeting-name-type"
                  />
                </Suspense>
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
            {shouldAnimateIllustration ? (
              <Suspense
                fallback={
                  <img
                    alt="Illustration of Brandon at a desk"
                    src={manOnTableSvg}
                    width="600"
                    height="450"
                    fetchPriority="high"
                    decoding="async"
                  />
                }
              >
                <DisplayLottie animationData={landingPerson} />
              </Suspense>
            ) : (
              <img
                alt="Illustration of Brandon at a desk"
                src={manOnTableSvg}
                width="600"
                height="450"
                fetchPriority="high"
                decoding="async"
              />
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
    </div>
  );
}
