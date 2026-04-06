import React, {lazy, Suspense, useContext} from "react";
import "./SplashScreen.css";
import {greeting, splashScreen} from "../../portfolio";
import StyleContext from "../../contexts/StyleContext";
import {usePrefersReducedMotion} from "../../hooks/usePrefersReducedMotion";

const DisplayLottie = lazy(
  () => import("../../components/displayLottie/DisplayLottie")
);

export default function SplashScreen() {
  const {isDark} = useContext(StyleContext);
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <div className={isDark ? "dark-mode splash-container" : "splash-container"}>
      <div className="splash-animation-container">
        {!prefersReducedMotion ? (
          <Suspense fallback={null}>
            <DisplayLottie animationData={splashScreen.animation} />
          </Suspense>
        ) : null}
      </div>
      <div className="splash-title-container">
        <span className="grey-color"> &lt;</span>
        <span className="splash-title">{greeting.username}</span>
        <span className="grey-color">/&gt;</span>
      </div>
    </div>
  );
}
