import React, {useState} from "react";
import Header from "../components/header/Header";
import Greeting from "./greeting/Greeting";
import Skills from "./skills/Skills";
import Education from "./education/Education";
import WorkExperience from "./workExperience/WorkExperience";
import Achievement from "./achievement/Achievement";
import AdditionalProjects from "../components/additionalProjects/AdditionalProjects";
import Contact from "./contact/Contact";
import Footer from "../components/footer/Footer";
import {StyleProvider} from "../contexts/StyleContext";
import "./Main.scss";

export default function Main() {
  // The server and first client render must agree. Theme preferences are handled
  // by CSS in the delivery follow-up, without changing the rendered content.
  const [isDark, setIsDark] = useState(true);
  return (
    <div className={isDark ? "dark-mode" : undefined}>
      <StyleProvider
        value={{isDark, changeTheme: () => setIsDark(value => !value)}}
      >
        <Header />
        <main id="main-content">
          <Greeting />
          <Skills />
          <Education />
          <WorkExperience />
          <Achievement />
          <AdditionalProjects />
          <Contact />
        </main>
        <Footer />
      </StyleProvider>
    </div>
  );
}
