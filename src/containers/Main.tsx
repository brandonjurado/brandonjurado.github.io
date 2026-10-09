import Header from "../components/header/Header";
import Greeting from "./greeting/Greeting";
import Skills from "./skills/Skills";
import Education from "./education/Education";
import SelectedSystems from "../features/systems/SelectedSystems";
import CareerTrace from "../features/experience/CareerTrace";
import OffTheClock from "../features/personal/OffTheClock";
import EarlierBuilds from "../features/builds/EarlierBuilds";
import Contact from "./contact/Contact";
import Footer from "../components/footer/Footer";
import {useSectionReveal} from "../motion/useSectionReveal";
import "./Main.scss";

export default function Main() {
  const main = useSectionReveal();
  return (
    <div className="site">
      <Header />
      <main id="main-content" ref={main}>
        <div className="overview-region">
          <Greeting />
        </div>
        <div className="depth-region">
          <Skills />
          <SelectedSystems />
          <CareerTrace />
          <OffTheClock />
          <EarlierBuilds />
          <Education />
        </div>
        <div className="legacy-sections">
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}
