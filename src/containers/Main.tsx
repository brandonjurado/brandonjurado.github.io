import Header from "../components/header/Header";
import Greeting from "./greeting/Greeting";
import Skills from "./skills/Skills";
import Education from "./education/Education";
import WorkExperience from "./workExperience/WorkExperience";
import Achievement from "./achievement/Achievement";
import AdditionalProjects from "../components/additionalProjects/AdditionalProjects";
import Contact from "./contact/Contact";
import Footer from "../components/footer/Footer";
import "./Main.scss";

export default function Main() {
  return (
    <div className="site">
      <Header />
      <main id="main-content">
        <div className="overview-region">
          <Greeting />
          <Skills />
        </div>
        <div className="legacy-sections">
          <WorkExperience />
          <Achievement />
          <AdditionalProjects />
          <Education />
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}
