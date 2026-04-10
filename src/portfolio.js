// To change portfolio colors globally go to the  _globalColor.scss file

import emoji from "react-easy-emoji";
import splashAnimation from "./assets/lottie/splashAnimation";

const images = import.meta.glob("./assets/images/*.{png,jpg,jpeg,svg,webp}", {
  eager: true,
  query: "?url",
  import: "default"
});

// Helper to fetch a URL by file name with a clear error if missing
const img = file => {
  const key = `./assets/images/${file}`;
  if (!images[key]) {
    throw new Error(`Image not found: ${key}`);
  }
  return images[key];
};

// Splash Screen

const splashScreen = {
  enabled: true, // set false to disable splash screen
  animation: splashAnimation,
  duration: 2000 // Set animation duration as per your animation
};

// Summary And Greeting Section

const illustration = {
  animated: true // Set to false to use static SVG
};

const greeting = {
  username: "Brandon Jurado",
  title: "Brandon Jurado",
  location: "Austin, TX",
  subTitle: emoji(
    "Software Engineer with experience spanning startup teams and Fortune 50 organizations, focused on building resilient backend platforms and customer-facing systems at scale. I enjoy turning complex product problems into dependable software, whether that means real-time notification pipelines, billing workflows, identity services, or the internal tools that keep those systems running smoothly."
  ),
  resumeLink: "",
  displayGreeting: true // Set false to hide this section, defaults to true
};

// Social Media Links

const socialMediaLinks = {
  github: "https://github.com/brandonjurado",
  linkedin: "https://www.linkedin.com/in/brandonjurado/",
  gmail: "hello@bjurado.com",
  gitlab: "",
  facebook: "",
  medium: "",
  stackoverflow: "",
  // Instagram, Twitter and Kaggle are also supported in the links!
  // To customize icons and social links, tweak src/components/SocialMedia
  display: true // Set true to display this section, defaults to false
};

// Skills Section

const skillsSection = {
  title: "What I do",
  subTitle:
    "Backend-focused engineer building scalable platforms, secure customer flows, and high-volume integrations",
  skills: [
    emoji(
      "⚡ Build high-throughput backend APIs and microservices for scalable, distributed systems"
    ),
    emoji(
      "⚡ Ship cloud-native systems across AWS and containerized platforms with an emphasis on reliability, observability, and maintainable delivery pipelines"
    ),
    emoji(
      "⚡ Contribute across the stack when needed, building frontend experiences and internal tools that improve both customer and operator workflows"
    )
  ],

  /* https://fontawesome.com/icons?d=gallery */
  softwareSkills: [
    {
      skillName: "Java",
      fontAwesomeClassname: "fab fa-java"
    },
    {
      skillName: "JavaScript",
      fontAwesomeClassname: "fab fa-js"
    },
    {
      skillName: "nodejs",
      fontAwesomeClassname: "fab fa-node"
    },
    {
      skillName: "npm",
      fontAwesomeClassname: "fab fa-npm"
    },
    {
      skillName: "sql-database",
      fontAwesomeClassname: "fas fa-database"
    },
    {
      skillName: "nosql-database",
      fontAwesomeClassname: "fas fa-database"
    },
    {
      skillName: "aws",
      fontAwesomeClassname: "fab fa-aws"
    },
    {
      skillName: "docker",
      fontAwesomeClassname: "fab fa-docker"
    },
    {
      skillName: "python",
      fontAwesomeClassname: "fab fa-python"
    },
    {
      skillName: "firebase",
      fontAwesomeClassname: "fas fa-fire"
    },
    {
      skillName: "angular",
      fontAwesomeClassname: "fab fa-angular"
    },
    {
      skillName: "reactjs",
      fontAwesomeClassname: "fab fa-react"
    },
    {
      skillName: "html-5",
      fontAwesomeClassname: "fab fa-html5"
    },
    {
      skillName: "css3",
      fontAwesomeClassname: "fab fa-css3-alt"
    },
    {
      skillName: "sass",
      fontAwesomeClassname: "fab fa-sass"
    }
  ],
  display: true // Set false to hide this section, defaults to true
};

// Education Section

const educationInfo = {
  display: true, // Set false to hide this section, defaults to true
  schools: [
    {
      schoolName: "Tarleton State University",
      logo: img("tarletonLogo.webp"),
      subHeader: "Bachelor of Science in Computer Science",
      duration: "August 2014 - May 2018 | Cum Laude",
      desc: "Maintained academic honors while working nearly 40 hours per week throughout undergrad.",
      descBullets: [
        "Computer Science Club Member",
        "Student Orientation Leader",
        "Executive Board Member, Risk Manager – Campus Leadership Org"
      ]
    }
  ]
};

// Work experience section

const workExperiences = {
  display: true, //Set it to true to show workExperiences Section
  experience: [
    {
      role: "Sr. Software Engineer",
      company: "H-E-B",
      companylogo: img("hebLogo.webp"),
      accentColor: "#d71920",
      date: "July 2023 – Present",
      desc: "At H-E-B Digital, I help build the event-driven notification platform behind curbside and order communications. My work centers on delivering near real-time, personalized alerts across the full order journey and scaling the platform to handle millions of promotional and transactional messages each day with the reliability those experiences require.",
      descBullets: [
        "Languages: Java, TypeScript, Bash",
        "Frameworks & Runtimes: Spring Boot, Dropwizard",
        "Cloud & IaC: AWS (SNS, SQS, EC2, ECS, Lambda, S3, IAM, RDS, SAM, CloudFormation), Terraform, Terragrunt",
        "Platform & Tooling: MySQL, Docker, LocalStack, GitLab CI/CD, Postman, Datadog, Backstage"
      ]
    },
    {
      role: "Software Engineer",
      company: "T-Mobile",
      companylogo: img("tmobileLogo.webp"),
      accentColor: "#e20074",
      date: "July 2021 – June 2023",
      desc: "Delivered billing and payments capabilities for T-Mobile for Business, shipping enterprise features while improving the health of core services through dependency remediation and major Java and Spring Boot upgrades. I also helped establish cleaner API development practices and built an invoicing solution for the Department of Education that integrated with legacy workflows and enabled a new revenue stream.",
      descBullets: [
        "Languages: Java, TypeScript",
        "Frameworks & UI: Spring Boot, Angular",
        "Cloud & Platform: AWS, Apigee, Kubernetes, Docker, Conduktor",
        "Data: Cassandra, Spring Data",
        "CI/CD & Tooling: GitLab CI/CD, Postman, Splunk"
      ]
    },
    {
      role: "Software Engineer",
      company: "USAA",
      companylogo: img("usaaLogo.webp"),
      accentColor: "#003087",
      date: "July 2019 – July 2021",
      desc: "Within USAA's Platform Infrastructure organization, I built identity and access management capabilities that processed customer verification signals in real time. I contributed to login, registration, and password reset flows for USAA.com, integrated identity checks with credit agencies, and created internal tools that helped call center teams investigate and prevent suspected fraud.",
      descBullets: [
        "Languages: Java, Groovy",
        "Frontend: React, Redux",
        "Frameworks: Spring Boot, Spring Data JPA, Spring Security, Spring WebFlux, Spring Actuator",
        "Platform & Data: Kafka, DB2, Couchbase, Docker, Kubernetes, OpenShift",
        "Observability & Security: Splunk, Kibana, Grafana, Prometheus, Jaeger, OpenTelemetry, PromQL, OAuth, Postman"
      ]
    },
    {
      role: "Software Engineer",
      company: "American Airlines",
      companylogo: img("americanAirlinesLogo.webp"),
      accentColor: "#0078d2",
      date: "June 2018 – July 2019",
      desc: "Played a hands-on role in modernizing the AA.com flight booking experience, helping move a core customer journey from a monolithic architecture to cloud-hosted microservices. That shift improved scalability, resilience, and performance for a platform serving millions of travelers.",
      descBullets: [
        "Languages: Kotlin, Java, TypeScript",
        "Frameworks & UI: Spring Boot, Spring Data JPA, Spring Security, Spring WebFlux, Angular",
        "Cloud & Delivery: IBM Bluemix, Kubernetes, Jenkins, GitHub Actions, Docker",
        "Data & Testing: Redis, JUnit, Selenium, Postman, OAuth",
        "Observability: Splunk, New Relic, Dynatrace, Tealeaf"
      ]
    },
    {
      role: "Software Engineer Intern",
      company: "UTx @ The University of Texas System",
      companylogo: img("utSystemLogo.webp"),
      accentColor: "#bf5700",
      date: "May 2016 – Aug 2016",
      desc: "Researched frontend approaches for a new product by prototyping applications with frameworks like React and evaluating what best matched the business use case. Alongside that exploration, I built internal LAMP-stack tools used to track development work across the organization.",
      descBullets: ["Stack: React prototyping, Linux, Apache, MySQL, PHP, JSON"]
    },
    {
      role: "Software Engineer",
      company: "TIAER",
      companylogo: img("tiaerLogo.webp"),
      accentColor: "#3f73b8",
      date: "Feb 2016 – May 2018",
      desc: "Led full-stack development of a web-based nutrient tracking platform from concept through delivery. I owned the frontend, backend services, databases, Linux infrastructure, and hosting footprint, while also bringing UX considerations into the product and mentoring junior developers on MVC-based application design.",
      descBullets: [
        "Core Stack: Ruby on Rails, MySQL, HTML, CSS, JavaScript, CoffeeScript, jQuery",
        "Quality & Delivery: Selenium, RSpec, Jenkins",
        "Infra & Operations: Linux, CRON, Batch jobs, Mailchimp"
      ]
    },
    {
      role: "Associate Software Engineer",
      company: "TIAER",
      companylogo: img("tiaerLogo.webp"),
      accentColor: "#3f73b8",
      date: "Feb 2015 – Feb 2016",
      desc: "Helped improve web application quality through a mix of exploratory testing, automated test development, debugging, and frontend support work. The role combined hands-on QA with practical engineering tasks so issues were identified early, corrected efficiently, and aligned with what the client actually needed.",
      descBullets: [
        "Testing & QA: Selenium, RSpec, MiniTest",
        "Frontend: HTML, CSS, JavaScript",
        "Application Development: Ruby on Rails"
      ]
    }
  ]
};

/* Your Open Source Section to View Your Github Pinned Projects
To know how to get github key look at readme.md */

const openSource = {
  showGithubProfile: "false", // Set true or false to show Contact profile using Github, defaults to true
  display: false // Set false to hide this section, defaults to true
};

// Achievement Section
// Include certificates, talks etc

const achievementSection = {
  title: emoji("Achievements And Certifications 🏆 "),
  subtitle: "Achievements, Certifications, Awards",

  achievementsCards: [
    {
      title: "Intuit Challenge Winner",
      subtitle: "Earth Hack 2018",
      description:
        "Built an Alexa skill that answers tax questions by scraping and ranking Intuit support content in real time. Implemented content parsing (BeautifulSoup), lightweight relevance scoring, and a Flask API deployed on AWS. Awarded Intuit’s event challenge winner.",
      image: img("askIntuit.webp"),
      imageAlt: "Ask Intuit Logo",
      footerLink: [
        {
          name: "DevPost",
          url: "https://devpost.com/software/ask-intuit"
        },
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/feed/update/urn:li:activity:6397897539412127744/"
        },
        {
          name: "Repository",
          url: "https://github.com/brandonjurado/AskIntuit"
        }
      ]
    },
    {
      title: "Hack UTD 2018 — Overall #3",
      subtitle: "Social Credit (NLP + Web)",
      description:
        "Prototyped a web app that estimates a borrower ‘trust’ score from public social signals. Built Vue.js front end and Python NLP pipeline to extract linguistic features and classify risk bands. Presented live to judges and placed 3rd overall.",
      image: img("socialCredit.webp"),
      imageAlt: "Social Credit Logo",
      footerLink: [
        {
          name: "DevPost",
          url: "https://devpost.com/software/hackutd-sizryx"
        },
        {
          name: "Repository",
          url: "https://github.com/brandonjurado/SocialCredit"
        }
      ]
    },
    {
      title: "Earth Hack 2017 — Finalist",
      subtitle: "HYTCH’D (Android + Maps)",
      description:
        "Developed an Android app to reduce emissions by coordinating shared rides to common destinations. Integrated Google Maps routing, live ETA, and cost-split UX. Selected as a finalist by judges.",
      image: img("hytchdLogo.webp"),
      imageAlt: "Hytchd logo",
      footerLink: [
        {
          name: "Repository",
          url: "https://github.com/brandonjurado/Ride-Hytch"
        }
      ]
    }
  ],
  display: true // Set false to hide this section, defaults to true
};

export const additionalProjects = {
  display: true,
  title: "Additional Projects",
  subtitle: "Smaller builds, experiments, and utilities worth a look.",
  items: [
    {
      name: "Game Browser",
      description:
        "Built a searchable game directory with Rails + AJAX for quick discovery and smooth client-side navigation.",
      tech: ["Ruby on Rails", "JavaScript", "AJAX"],
      links: [
        {
          name: "Repository",
          url: "https://github.com/brandonjurado/Game-Browser"
        }
      ]
    },
    {
      name: "Gone",
      description:
        "Created a travel planner that streamlined trip organization, showcasing Laravel for backend reliability.",
      tech: ["PHP", "Laravel"],
      links: [
        {
          name: "Repository",
          url: "https://github.com/brandonjurado/Gone-Travel"
        }
      ]
    },
    {
      name: "Food Scrapper",
      description:
        "Engineered a scraper to extract recipe ingredients into structured shopping lists using React + Node.js.",
      tech: ["React", "Node.js"],
      links: [
        {name: "DevPost", url: "https://devpost.com/software/food-scrapper"},
        {name: "Repository", url: "https://github.com/psward/hackUTA"}
      ]
    },
    {
      name: "Fantastic MCMC",
      description:
        "Prototyped a mapping tool with Express + Leaflet, enabling fast geographic data visualization.",
      tech: ["Express", "Leaflet"],
      links: [
        {name: "DevPost", url: "https://devpost.com/software/fantastic-mcmc"}
      ]
    },
    {
      name: "TSU Lambda Chi",
      description:
        "Developed a responsive site to modernize a university org’s online presence",
      tech: ["WordPress", "JS", "HTML/CSS"],
      links: [
        {
          name: "Visit",
          url: "https://web.archive.org/web/20180321081553/http://tsulambdachi.com/"
        }
      ]
    },
    {
      name: "Socially Distanced Pantry",
      description:
        "Built a React app during Earth Hack 2020 that let communities share pantry goods and reduce shortages.",
      tech: ["React"],
      links: [
        {
          name: "DevPost",
          url: "https://devpost.com/software/covid19hack-ma4nh3"
        },
        {
          name: "Repository",
          url: "https://github.com/brandonjurado/Covid19Hack"
        }
      ]
    }
  ]
};

const landingMarquee = {
  display: true,
  keywords: [
    "Distributed Systems",
    "Microservices",
    "Cloud Infrastructure",
    "API Design",
    "Data Streaming",
    "Observability",
    "CI/CD",
    "Performance Engineering"
  ],
  brands: [
    "H-E-B",
    "T-Mobile",
    "USAA",
    "American Airlines",
    "UT System",
    "TIAER"
  ]
};

const footerSection = {
  display: true,
  statement: "Always building resilient systems.",
  legalText: "All rights reserved."
};

const contactInfo = {
  title: emoji("Get In Touch"),
  subtitle:
    "Let's connect. I'm always open to new opportunities, collaborations, or just talking shop.",
  number: "",
  email_address: ""
};

const isHireable = false; // Set false if you are not looking for a job. Also isHireable will be display as Open for opportunities: Yes/No in the GitHub footer

export {
  illustration,
  greeting,
  socialMediaLinks,
  splashScreen,
  skillsSection,
  educationInfo,
  workExperiences,
  openSource,
  achievementSection,
  landingMarquee,
  footerSection,
  contactInfo,
  isHireable
};
