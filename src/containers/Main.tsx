import Header from "../components/header/Header";
import Greeting from "./greeting/Greeting";
import Skills from "./skills/Skills";
import Education from "./education/Education";
import SelectedSystems from "../features/systems/SelectedSystems";
import CareerTrace from "../features/experience/CareerTrace";
import EngineeringNotes from "../features/notes/EngineeringNotes";
import OffTheClock from "../features/personal/OffTheClock";
import EarlierBuilds from "../features/builds/EarlierBuilds";
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
        <div className="depth-region">
          <SelectedSystems />
          <CareerTrace />
          <EngineeringNotes />
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
