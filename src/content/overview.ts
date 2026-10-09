import {site} from "./site";
export type Capability = {
  id: "services" | "data" | "cloud" | "reliability";
  title: string;
  description: string;
  technologies: readonly string[];
};

export const overview = {
  name: site.name,
  role: site.role,
  location: site.location,
  headline: ["Event-driven", "backend systems."],
  description:
    "Senior software engineer. Java, Spring Boot, Kafka, and AWS across identity and access management, event-driven messaging, e-commerce, and payments.",
  contactLabel: "Get in touch",
  experienceLabel: "View experience",
  proofLabel: "Work across teams at",
  employers: ["H-E-B", "T-Mobile", "USAA", "American Airlines"],
  personalTitle: "Always curious.",
  personalDescription:
    "My interest in engineering started with taking apart game consoles to understand how they worked. Before building software professionally, I was repairing handhelds, replacing friends’ phone screens, and experimenting with custom software. That curiosity still drives me: I enjoy understanding what happens under the hood and using that knowledge to build something useful.",
  capabilitiesTitle: "What I do.",
  capabilitiesDescription:
    "Services, data, infrastructure, and the work that keeps them running.",
  fluencyLabel: "Also fluent in",
  fluent: ["React", "Angular", "Python"]
} as const;

export const capabilities = [
  {
    id: "services",
    title: "Services & APIs",
    description:
      "I build services and APIs that connect products and customer workflows.",
    technologies: [
      "Java",
      "Kotlin",
      "TypeScript",
      "Spring Boot",
      "Dropwizard",
      "OpenAPI"
    ]
  },
  {
    id: "data",
    title: "Data & messaging",
    description:
      "I work with the data and message flows those services rely on.",
    technologies: ["MySQL", "DynamoDB", "Cassandra", "Kafka", "SQS/SNS"]
  },
  {
    id: "cloud",
    title: "Cloud & infrastructure",
    description: "I provision infrastructure and make deployment repeatable.",
    technologies: [
      "AWS",
      "Terraform/Terragrunt",
      "Docker",
      "Kubernetes",
      "GitLab CI/CD"
    ]
  },
  {
    id: "reliability",
    title: "Reliability & observability",
    description:
      "I make failures easier to detect, understand, and recover from.",
    technologies: [
      "Datadog",
      "Splunk",
      "OpenTelemetry",
      "PagerDuty",
      "SLOs",
      "Runbooks",
      "RCAs"
    ]
  }
] as const satisfies readonly Capability[];
