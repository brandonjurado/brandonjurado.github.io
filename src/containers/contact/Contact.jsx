import React, {lazy, Suspense, useContext} from "react";
import "./Contact.scss";
import SocialMedia from "../../components/socialMedia/SocialMedia";
import {illustration, contactInfo} from "../../portfolio";
import {motion as m} from "framer-motion";
import email from "../../assets/lottie/email";
import StyleContext from "../../contexts/StyleContext";
import contactMailDarkSvg from "../../assets/images/contactMailDark.svg?url";
import {usePrefersReducedMotion} from "../../hooks/usePrefersReducedMotion";

const DisplayLottie = lazy(
  () => import("../../components/displayLottie/DisplayLottie")
);

export default function Contact() {
  const {isDark} = useContext(StyleContext);
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimateIllustration =
    illustration.animated && !prefersReducedMotion;
  return (
    <m.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 1}}
      viewport={{once: true, amount: 0.2}}
    >
      <div className="main contact-margin-top" id="contact">
        <div className="contact-div-main">
          <div className="contact-header">
            <h1 className="heading contact-title">{contactInfo.title}</h1>
            <p
              className={
                isDark
                  ? "dark-mode contact-subtitle"
                  : "subTitle contact-subtitle"
              }
            >
              {contactInfo.subtitle}
            </p>
            <div
              className={
                isDark ? "dark-mode contact-text-div" : "contact-text-div"
              }
            >
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
              <a
                className="contact-detail-email"
                href={"mailto:" + contactInfo.email_address}
              >
                {contactInfo.email_address}
              </a>
              <br />
              <br />
              <SocialMedia />
            </div>
          </div>
          <div className="contact-image-div">
            {shouldAnimateIllustration ? (
              <Suspense
                fallback={
                  <img
                    alt="Contact illustration"
                    src={contactMailDarkSvg}
                    width="480"
                    height="360"
                    loading="lazy"
                    decoding="async"
                  />
                }
              >
                <DisplayLottie animationData={email} />
              </Suspense>
            ) : (
              <img
                alt="Contact illustration"
                src={contactMailDarkSvg}
                width="480"
                height="360"
                loading="lazy"
                decoding="async"
              />
            )}
          </div>
        </div>
      </div>
    </m.div>
  );
}
