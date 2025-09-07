/** @jsx jsx */
import { jsx } from "theme-ui"
import Divider from "../elements/divider"
import Inner from "../elements/inner"
import Content from "../elements/content"
import SVG from "./svg"
import { UpDown, UpDownWide } from "../styles/animations"
import { FaCheck, FaAngleRight } from 'react-icons/fa';

// @ts-ignore
import SkillsMDX from "../sections/Skills"


const Skills = ({ offset, factor = 1 }: { offset: number; factor?: number }) => (
  <div>
    <Divider
      bg="divider"
      clipPath="polygon(0 16%, 100% 4%, 100% 82%, 0 94%)"
      speed={0.2}
      offset={offset}
      factor={factor}
    />
    <Divider speed={0.1} offset={offset} factor={factor}>
      <UpDown>
        <SVG icon="box" hiddenMobile width={6} color="icon_blue" left="50%" top="75%" />
        <SVG icon="upDown" hiddenMobile width={8} color="icon_darkest" left="70%" top="20%" />
        <SVG icon="triangle" width={8} stroke color="icon_darkest" left="25%" top="5%" />
        <SVG icon="upDown" hiddenMobile width={24} color="icon_orange" left="80%" top="80%" />
      </UpDown>
      <UpDownWide>
        <SVG icon="arrowUp" hiddenMobile width={16} color="icon_purple" left="5%" top="80%" />
        <SVG icon="triangle" width={12} stroke color="icon_brightest" left="95%" top="50%" />
        <SVG icon="circle" hiddenMobile width={6} color="icon_brightest" left="85%" top="15%" />
        <SVG icon="upDown" hiddenMobile width={8} color="icon_darkest" left="45%" top="10%" />
      </UpDownWide>
      <SVG icon="circle" hiddenMobile width={6} color="icon_brightest" left="4%" top="20%" />
      <SVG icon="circle" width={12} color="icon_darkest" left="70%" top="60%" />
      <SVG icon="box" width={6} color="icon_orange" left="15%" top="10%" />
      <SVG icon="box" width={12} color="icon_darkest" left="20%" top="30%" />
      <SVG icon="hexa" width={8} stroke color="icon_darkest" left="80%" top="70%" />
    </Divider>
    <Content speed={0.4} offset={offset} factor={factor} className={`resume-section`}>
      <Inner>
        <SkillsMDX />
        <div className="resume-section-content" id="skills">
            <div className="subheading mb-3">Programming Languages & Tools</div>

            <ul className="list-inline dev-icons">
                <li className="list-inline-item">
                    <i className="devicon-java-plain-wordmark"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-python-plain-wordmark colored"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-html5-plain-wordmark colored"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-rails-plain-wordmark colored"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-ruby-plain-wordmark colored"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-angularjs-plain colored"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-javascript-plain colored"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-react-original-wordmark colored"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-typescript-plain colored"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-git-plain colored"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-redis-plain-wordmark colored"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-groovy-plain colored"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-css3-plain-wordmark colored"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-gradle-plain"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-wordpress-plain-wordmark"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-nodejs-plain-wordmark colored"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-docker-plain-wordmark colored"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-bootstrap-plain-wordmark"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-foundation-plain-wordmark colored"></i>
                </li>
                <li className="list-inline-item">
                    <i className="devicon-npm-original-wordmark colored"></i>
                </li>
            </ul>

            <ul className="fa-ul mb-0" style={{fontSize: 1 + "rem"}}>
                <li>
                    <span className="fa-li"><FaAngleRight /></span>
                    Kotlin
                </li>
                <li>
                    <span className="fa-li"><FaAngleRight /></span>
                    Couchbase
                </li>
                <li>
                    <span className="fa-li"><FaAngleRight /></span>
                    NoSQL
                </li>
                <li>
                    <span className="fa-li"><FaAngleRight /></span>
                    SQL
                </li>
                <li>
                    <span className="fa-li"><FaAngleRight /></span>
                    Agile Methodologies
                </li>
                <li>
                    <span className="fa-li"><FaAngleRight /></span>
                    Jenkins
                </li>
                <li>
                    <span className="fa-li"><FaAngleRight /></span>
                    Kafka
                </li>
                <li>
                    <span className="fa-li"><FaAngleRight /></span>
                    Selenium
                </li>
                <li>
                    <span className="fa-li"><FaAngleRight /></span>
                    Cloud Technologies
                </li>
                <li>
                    <span className="fa-li"><FaAngleRight /></span>
                    CI/CD
                </li>
                <li>
                    <span className="fa-li"><FaAngleRight /></span>
                    Spring
                </li>
            </ul>

          <div className="subheading">Workflow</div>

          <ul className="fa-ul mb-0" style={{fontSize: 1 + "rem"}}>
              <li>
                  <span className="fa-li"><FaCheck /></span>
                  Mobile-First, Responsive Design
              </li>
              <li>
                  <span className="fa-li"><FaCheck /></span>
                  Cross Functional Teams
              </li>
              <li>
                  <span className="fa-li"><FaCheck /></span>
                  Agile Development, Scrum &amp; Kanban
              </li>
          </ul>
        </div>
      </Inner>
    </Content>
  </div>
)

export default Skills
