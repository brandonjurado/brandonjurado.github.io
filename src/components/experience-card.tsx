/** @jsx jsx */
import React from "react"
import { jsx } from "theme-ui"

type ExperienceCardProps = {
  title: string
  years: string
  company: string
  children: React.ReactNode
  relatedItems: string
  bg: string
}


const ExperienceCard = ({ title, company, children, relatedItems, years, bg }: ExperienceCardProps) => (
  <div className={`flexBox`}
    sx={{
      width: `100%`,
      boxShadow: `lg`,
      position: `relative`,
      textDecoration: `none`,
      borderRadius: `lg`,
      px: 3,
      py: 2,
      color: `white`,
      background: bg || `none`,
      transition: `all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important`,
      textShadow: `0 2px 10px rgba(0, 0, 0, 0.3)`,
      margin: `0 auto`
    }}
  >
    <div
      sx={{
        flexGrow: 1,
      }}
    >
      <h3>{title}</h3>
      <div className={`subheading`}>{company}</div>
      <p>{children}</p>
      {title !== 'Tarleton State University'? <p><strong>Tech: </strong>{relatedItems}</p>: null }
    </div>
    <div
      sx={{
        flexShrink: 0
      }}
    >
      <p>{years}</p>
    </div>
  </div>
)

export default ExperienceCard
