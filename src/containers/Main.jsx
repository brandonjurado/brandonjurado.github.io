import React, {
  lazy,
  startTransition,
  Suspense,
  useEffect,
  useState
} from "react";
import Header from "../components/header/Header";
import Greeting from "./greeting/Greeting";
import ScrollToTopButton from "./topbutton/Top";
import SplashScreen from "./splashScreen/SplashScreen";
import {splashScreen} from "../portfolio";
import {StyleProvider} from "../contexts/StyleContext";
import {useLocalStorage} from "../hooks/useLocalStorage";
import {usePrefersReducedMotion} from "../hooks/usePrefersReducedMotion";
import "./Main.scss";

// Lazy sections
const Skills = lazy(() => import("./skills/Skills"));
const Education = lazy(() => import("./education/Education"));
const WorkExperience = lazy(() => import("./workExperience/WorkExperience"));
const Achievement = lazy(() => import("./achievement/Achievement"));
const AdditionalProjects = lazy(
  () => import("../components/additionalProjects/AdditionalProjects")
);
const Profile = lazy(() => import("./profile/Profile"));
const Footer = lazy(() => import("../components/footer/Footer"));

const SECTION_REVEAL_ORDER = [
  "skills",
  "education",
  "experience",
  "achievement",
  "projects",
  "profile",
  "footer"
];

function getShouldShowSplash(prefersReducedMotion) {
  if (
    typeof window === "undefined" ||
    !splashScreen.enabled ||
    prefersReducedMotion
  ) {
    return false;
  }

  try {
    return window.sessionStorage.getItem("hasSeenSplash") !== "true";
  } catch {
    return true;
  }
}

const Main = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isDark, setIsDark] = useLocalStorage(
    "isDark",
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [isShowingSplashAnimation, setIsShowingSplashAnimation] = useState(() =>
    getShouldShowSplash(prefersReducedMotion)
  );
  const [revealedSections, setRevealedSections] = useState({});

  useEffect(() => {
    if (!splashScreen.enabled || prefersReducedMotion) {
      setIsShowingSplashAnimation(false);
      return undefined;
    }

    if (!isShowingSplashAnimation) {
      return undefined;
    }

    const splashTimer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem("hasSeenSplash", "true");
      } catch {
        // Ignore private-mode storage failures.
      }
      setIsShowingSplashAnimation(false);
    }, splashScreen.duration);

    return () => window.clearTimeout(splashTimer);
  }, [isShowingSplashAnimation, prefersReducedMotion]);

  useEffect(() => {
    if (isShowingSplashAnimation) {
      return undefined;
    }

    const cleanups = [];

    const revealSection = sectionKey => {
      startTransition(() => {
        setRevealedSections(previousSections => {
          if (previousSections[sectionKey]) {
            return previousSections;
          }

          return {
            ...previousSections,
            [sectionKey]: true
          };
        });
      });
    };

    SECTION_REVEAL_ORDER.forEach((sectionKey, index) => {
      const timeoutId = window.setTimeout(() => {
        if (typeof window.requestIdleCallback === "function") {
          const idleId = window.requestIdleCallback(
            () => revealSection(sectionKey),
            {timeout: 600}
          );
          cleanups.push(() => window.cancelIdleCallback(idleId));
          return;
        }

        revealSection(sectionKey);
      }, index * 120);

      cleanups.push(() => window.clearTimeout(timeoutId));
    });

    return () => {
      cleanups.forEach(cleanup => cleanup());
    };
  }, [isShowingSplashAnimation]);

  const changeTheme = () => setIsDark(!isDark);

  return (
    <div className={isDark ? "dark-mode" : null}>
      <StyleProvider value={{isDark: isDark, changeTheme: changeTheme}}>
        {isShowingSplashAnimation && splashScreen.enabled ? (
          <SplashScreen />
        ) : (
          <>
            <Header />
            <Greeting />
            <Suspense fallback={null}>
              {revealedSections.skills ? <Skills /> : null}
              {revealedSections.education ? <Education /> : null}
              {revealedSections.experience ? <WorkExperience /> : null}
              {revealedSections.achievement ? <Achievement /> : null}
              {revealedSections.projects ? <AdditionalProjects /> : null}
              {revealedSections.profile ? <Profile /> : null}
              {revealedSections.footer ? <Footer /> : null}
            </Suspense>
            <ScrollToTopButton />
          </>
        )}
      </StyleProvider>
    </div>
  );
};

export default Main;
