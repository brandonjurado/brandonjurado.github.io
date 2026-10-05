import Header from "../components/header/Header";
import Greeting from "./greeting/Greeting";
import Skills from "./skills/Skills";
import Education from "./education/Education";
import WorkExperience from "./workExperience/WorkExperience";
import Achievement from "./achievement/Achievement";
import AdditionalProjects from "../components/additionalProjects/AdditionalProjects";
import Contact from "./contact/Contact";
import Top from "./topbutton/Top";
import Footer from "../components/footer/Footer";
import "./Main.scss";

export default function Main() {
  return (
    <div className="site">
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
      <Top />
    </div>
  );
}
