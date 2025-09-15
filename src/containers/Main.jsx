import React, {useEffect, useState, lazy, Suspense} from "react";
import Header from "../components/header/Header";
import Greeting from "./greeting/Greeting";
import ScrollToTopButton from "./topbutton/Top";
import SplashScreen from "./splashScreen/SplashScreen";
import {splashScreen} from "../portfolio";
import {StyleProvider} from "../contexts/StyleContext";
import {useLocalStorage} from "../hooks/useLocalStorage";
import "./Main.scss";

// Lazy sections
const Skills = lazy(() => import("./skills/Skills"));
const Education = lazy(() => import("./education/Education"));
const WorkExperience = lazy(() => import("./workExperience/WorkExperience"));
const Achievement = lazy(() => import("./achievement/Achievement"));
const AdditionalProjects = lazy(() =>
  import("../components/additionalProjects/AdditionalProjects")
);
const Profile = lazy(() => import("./profile/Profile"));
const Footer = lazy(() => import("../components/footer/Footer"));

const Main = () => {
  const darkPref = window.matchMedia("(prefers-color-scheme: dark)");
  const [isDark, setIsDark] = useLocalStorage("isDark", darkPref.matches);
  const [isShowingSplashAnimation, setIsShowingSplashAnimation] =
    useState(true);

  useEffect(() => {
    if (splashScreen.enabled) {
      const t = setTimeout(
        () => setIsShowingSplashAnimation(false),
        splashScreen.duration
      );
      return () => clearTimeout(t);
    }
  }, []);

  const changeTheme = () => setIsDark(!isDark);

  return (
    <div className={isDark ? "dark-mode" : null}>
      <StyleProvider value={{isDark, changeTheme}}>
        {isShowingSplashAnimation && splashScreen.enabled ? (
          <SplashScreen />
        ) : (
          <>
            <Header />
            <Greeting />
            <Suspense fallback={null}>
              <Skills />
              <Education />
              <WorkExperience />
              <Achievement />
              <AdditionalProjects />
              <Profile />
              <Footer />
            </Suspense>
            <ScrollToTopButton />
          </>
        )}
      </StyleProvider>
    </div>
  );
};

export default Main;
