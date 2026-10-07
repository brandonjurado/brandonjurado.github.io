import {achievementSection, additionalProjects} from "./portfolio";

type BuildLink = {
  name: string;
  url: string;
};

export type EarlierBuild = {
  name: string;
  description: string;
  technologies: readonly string[];
  links: readonly BuildLink[];
};

export type FeaturedBuild = EarlierBuild & {
  recognition: string;
};

const [askIntuit, socialCredit, hytchd] = achievementSection.achievementsCards;

export const buildsCopy = {
  title: achievementSection.title,
  description: "Hackathon projects and smaller builds.",
  moreTitle: "More builds",
  moreDescription: additionalProjects.subtitle
} as const;

export const featuredBuilds = [
  {
    name: "Ask Intuit",
    recognition: "Intuit Challenge Winner · Earth Hack 2018",
    description: askIntuit.description,
    technologies: ["Flask", "Python", "AWS"],
    links: askIntuit.footerLink
  },
  {
    name: "Social Credit",
    recognition: "Hack UTD 2018 · #3 overall",
    description: socialCredit.description,
    technologies: ["Vue.js", "Python", "NLP"],
    links: socialCredit.footerLink
  },
  {
    name: "HYTCH’D",
    recognition: "Earth Hack 2017 · Finalist",
    description: hytchd.description,
    technologies: ["Android"],
    links: hytchd.footerLink
  }
] as const satisfies readonly FeaturedBuild[];

export const moreBuilds = additionalProjects.items.map(project => ({
  name: project.name,
  description: project.description,
  technologies: project.tech,
  links: project.links
})) satisfies readonly EarlierBuild[];
