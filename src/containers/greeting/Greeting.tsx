import Illustration from "../../components/illustration/Illustration";
import {useHeroMotion} from "../../motion/useHeroMotion";
import "./Greeting.scss";
import SocialMedia from "../../components/socialMedia/SocialMedia";
import Button from "../../components/button/Button";
import {greeting, landingMarquee} from "../../content/portfolio";

export default function Greeting() {
  useHeroMotion();
  const marqueeKeywords = landingMarquee?.keywords ?? [];
  const marqueeBrands = landingMarquee?.brands ?? [];
  const loopItems = (items: string[]) => [...items, ...items];

  if (!greeting.displayGreeting) {
    return null;
  }
  return (
    <div>
      <div className="greet-main" id="greeting">
        <div className="greeting-main">
          <div className="greeting-text-div">
            <div>
              <h1 className="greeting-text">
                <span className="greeting-name-type">{greeting.title}</span>
              </h1>
              <p className="greeting-text-subheading subTitle">
                <span className="location">{greeting.location}</span>
              </p>
              <p className="greeting-text-p subTitle">{greeting.subTitle}</p>
              <SocialMedia />
              <div className="button-greeting-div">
                <Button text="Contact me" href="#contact" />
              </div>
            </div>
          </div>
          <div className="greeting-image-div">
            <Illustration
              name="landingPerson"
              label="Illustration of Brandon at a desk"
              eager
            />
            <div className="intro-illustration">
              <Illustration name="splashAnimation" label="" eager />
            </div>
          </div>
        </div>
        {landingMarquee?.display &&
          (marqueeKeywords.length > 0 || marqueeBrands.length > 0) && (
            <div className="landing-marquee" aria-hidden="true">
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
