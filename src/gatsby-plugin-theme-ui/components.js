import React from "react"
import ProjectCard from "../components/project-card"
import ExperienceCard from "../components/experience-card"

const components = {
  // eslint-disable-next-line react/display-name
  ProjectCard: ({ link, title, bg, children }) => (
    <ProjectCard link={link} title={title} bg={bg}>
      {children}
    </ProjectCard>
  ),
  ExperienceCard: ({ title, years, company, jobDescription, relatedItems, bg, children }) => (
    <ExperienceCard title={title} years={years} company={company} jobDescription={jobDescription} relatedItems={relatedItems} bg={bg}>
      {children}
    </ExperienceCard>
  ),
}

export default components
