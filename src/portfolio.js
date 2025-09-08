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
    "Software Engineer with a focus on building scalable, high-impact backend systems. I bring a strong foundation in OOP and distributed systems, shaped by experience across startups and Fortune 50 environments. Passionate about clean code, system design, and delivering reliable infrastructure at scale."
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
  subTitle: "Backend engineer who builds scalable, high-performance systems",
  skills: [
    emoji(
      "⚡ Build robust backend APIs and microservices for high-throughput systems"
    ),
    emoji(
      "⚡ Integrate cloud services like AWS, Firebase, and third-party APIs into production workflows"
    ),
    emoji(
      "⚡ Deliver seamless web experiences with React, Angular, and responsive UIs"
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
      schoolName: "Tarleton University",
      logo: img("tarletonLogo.jpeg"),
      subHeader: "Bachelors of Science in Computer Science",
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
      date: "July 2023 – Present",
      desc: "Unexpected item in the coding area... As part of H-E-B Digital, I am actively contributing to the rapidly growing organization and building products related to Curbside Delivery.",
      descBullets: [
        "Languages: Java, TypeScript",
        "Frameworks & Runtimes: Spring Boot, Dropwizard, Node.js",
        "Cloud & Infra: AWS (Lambda, ECS, S3, EventBridge), Terraform, GitLab CI, Docker",
        "Data & Streaming: MySQL, DynamoDB, Kafka",
        "CI/CD & Testing: GitLab CI/CD, Newman, JUnit, Jest",
        "Observability: Datadog"
      ]
    },
    {
      role: "Software Engineer",
      company: "T-Mobile",
      companylogo: img("tmobileLogo.jpeg"),
      date: "July 2021 – July 2023",
      desc: "Worked extensively with microservices to create an Ad-Hoc invoicing system solution to onboard large business line customers. Using Spring Boot services with a Cassandra persistence layer and AWS S3 storage, all presented to the user with an Angular frontend.",
      descBullets: [
        "Languages: Java, TypeScript",
        "Frameworks & UI: Spring Boot, Angular",
        "Cloud & Infra: AWS (S3, Lambda), Kubernetes (K8s), Docker, Terraform",
        "Data: Cassandra",
        "CI/CD & Testing: GitLab CI/CD, Newman, JUnit, Jest",
        "Observability: Splunk"
      ]
    },
    {
      role: "Software Engineer",
      company: "USAA",
      companylogo: img("usaaLogo.jpeg"),
      date: "July 2019 – Sep 2021",
      desc: "Created and Deployed several distributed microservices using Kafka, Spring WebFlux and Spring Data to store critical data to be used for analysis.",
      descBullets: [
        "Languages: Java",
        "Frameworks: Spring Boot, Spring WebFlux, Spring Data",
        "Platform: OpenShift, Docker",
        "Data & Streaming: DB2, Kafka",
        "Testing: JUnit",
        "Observability: Splunk, Kibana, Grafana, Prometheus, Jaeger, OpenTelemetry"
      ]
    },
    {
      role: "Software Engineer",
      company: "American Airlines",
      companylogo: img("americanAirlinesLogo.jpeg"),
      date: "May 2018 – July 2019",
      desc: "Delivered quality software iteratively through DevOps pipeline as part of a Scrum team, using Jenkins for automated testing and deployment. Decomposed existing monolothic code base into Spring Boot microservices running in a cloud environment that is used by millions of users based on analytics. If you have ever booked a flight through AA.com you have definitely seen my work. 😄",
      descBullets: [
        "Languages: Java, Kotlin, Typescript",
        "Frameworks & UI: Spring Boot, Angular, Apache Struts",
        "Cloud & CI/CD: IBM Cloud (Bluemix), Jenkins, GitHub Actions, Docker",
        "Data & Caching: Redis",
        "Observability: Splunk, New Relic, Dynatrace, Tealeaf"
      ]
    },
    {
      role: "Software Engineer (Intern)",
      company: "UTx @ The University of Texas System",
      companylogo: img("utSystemLogo.webp"),
      date: "May 2016 – Aug 2016",
      desc: "Developed internal web-based tools on LAMP stacks for tracking development projects, keeping the graphical user interface design in mind with HTML. Generated web services layer in PHP and a JSON message structure for consumption by the message architecture.  Additionally, defined and developed PCI compliant API structures.",
      descBullets: ["Stack: Linux, Apache, MySQL, PHP, JSON"]
    },
    {
      role: "Full Stack Developer",
      company: "TIAER",
      companylogo: img("tiaerLogo.webp"),
      date: "Feb 2016 – May 2018",
      desc: "Managed the interchange of data between the server and the users. Focused on the development of all server-side logic and maintenance of the central database &amp servers, while ensuring high performance and responsiveness to requests from the front-end. Created and integrated the front-end elements into web applications and familiarized junior developers with MVC frameworks.",
      descBullets: [
        "Stack: Ruby on Rails, RSpec, Selenium, HTML/CSS/JS, MySQL, Jenkins, Linux"
      ]
    },
    {
      role: "QA Engineer (Intern)",
      company: "TIAER",
      companylogo: img("tiaerLogo.webp"),
      date: "Feb 2015 – Feb 2016",
      desc: "Provided end-to-end solutions to software quality problems by developing and executing exploratory and automated tests to ensure quality of web applications, while also handling front-end programming tasks. Designed and implemented tests, debugged and defined corrective actions. Conducted tests to ensure software ran smoothly and met client needs, while being cost-effective.",
      descBullets: ["Tools: Selenium, RSpec, Cucumber, JavaScript, HTML/CSS"]
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
      image: img("askIntuit.jpg"),
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
      image: img("socialCredit.jpg"),
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
      image: img("hytchdLogo.png"),
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

const contactInfo = {
  title: emoji("Get In Touch"),
  subtitle:
    "Let's connect — I'm always open to new opportunities, collaborations, or just talking shop.",
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
  contactInfo,
  isHireable
};
