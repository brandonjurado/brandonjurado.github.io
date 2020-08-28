import React from "react"
import { Parallax } from "react-spring/renderprops-addons.cjs"
import Layout from "../components/layout"
import Hero from "../components/hero"
import About from "../components/about"
import Experience from "../components/experience"
import Education from "../components/education"
import Skills from "../components/skills"
import Interests from "../components/interests"
import Projects from "../components/projects"
import Contact from "../components/contact"
import "../styles/override.css"
import "../styles/scss/styles.scss"

const Main = () => (
  <Layout>
    <Parallax pages={8}>
      <Hero offset={0} factor={1} />
      <Experience offset={1} factor={3} />
      <Education offset={4} factor={1} />
      <Skills offset={5} factor={1} />
      <Interests offset={6} factor={1} />

      {/*
        <About offset={1} factor={1} />
      */}

      <Projects offset={6} factor={1} />
      <Contact offset={7} factor={1} />
    </Parallax>
  </Layout>
)

export default Main