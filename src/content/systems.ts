export type SystemId = "notifications" | "identity" | "billing" | "booking";

export type SelectedSystem = {
  id: SystemId;
  label: string;
  title: string;
  summary: string;
  technologies: readonly string[];
  diagramTitle: string;
  diagramDescription: string;
  outcome: "TODO";
};

export const systemsCopy = {
  title: "Systems I’ve built.",
  introduction:
    "Customer messaging, identity, billing, and booking. Different problems, with services and APIs at the center.",
  tabsLabel: "Choose a system",
  toolsLabel: "Tools used",
  diagramLabel: "Illustrative",
  diagramNote:
    "Simplified diagrams to explain the work, with generic names and boundaries."
} as const;

export const selectedSystems = [
  {
    id: "notifications",
    label: "Notifications",
    title: "Keep customers informed along an order journey.",
    summary:
      "Built near real-time customer messaging across an order journey, connecting backend events to the messages customers receive.",
    technologies: ["Java", "Spring Boot", "AWS SQS / SNS", "Terraform"],
    diagramTitle: "From an order event to a message",
    diagramDescription:
      "An illustrative order event passes through routing, queued delivery, and messaging, then branches into Push, Email, and SMS channels. These are generic stages, not production service names.",
    outcome: "TODO"
  },
  {
    id: "identity",
    label: "Identity",
    title: "Make verification signals available when they’re needed.",
    summary:
      "Worked on real-time identity verification for login and registration, alongside tools that support fraud investigations.",
    technologies: ["Java", "Spring Boot", "React", "OpenTelemetry"],
    diagramTitle: "Verification across customer actions",
    diagramDescription:
      "An illustrative flow brings login and registration into verification signals, then connects those signals to account decisions and investigation tools. It does not represent a production topology.",
    outcome: "TODO"
  },
  {
    id: "billing",
    label: "Billing",
    title: "Connect enterprise billing to established workflows.",
    summary:
      "Built enterprise billing services and an invoicing integration that connected new application work to legacy workflows.",
    technologies: ["Java", "Spring Boot", "Angular", "Cassandra"],
    diagramTitle: "Billing meets an existing workflow",
    diagramDescription:
      "An illustrative enterprise request moves through a billing service and invoice integration to a legacy workflow. The diagram shows the integration boundary rather than internal implementation details.",
    outcome: "TODO"
  },
  {
    id: "booking",
    label: "Booking",
    title: "Move a flight-booking journey into cloud services.",
    summary:
      "Helped move a flight-booking journey from a monolith to cloud microservices, working across backend services and the customer-facing application.",
    technologies: ["Kotlin", "Spring Boot", "Angular", "Kubernetes"],
    diagramTitle: "A booking journey, across a migration",
    diagramDescription:
      "An illustrative migration overview shows a monolith as the starting point and a booking API connected to cloud services as the destination. The migration arrow is not a live request path.",
    outcome: "TODO"
  }
] as const satisfies readonly SelectedSystem[];

export const systemDiagramCopy = {
  notifications: {
    stages: ["Order event", "Routing", "Queued delivery", "Messaging"],
    channels: ["Push", "Email", "SMS"]
  },
  identity: {
    inputs: ["Login", "Registration"],
    center: "Verification signals",
    outputs: ["Account decisions", "Investigation tools"]
  },
  billing: {
    stages: [
      "Enterprise request",
      "Billing service",
      "Invoice integration",
      "Legacy workflow"
    ]
  },
  booking: {
    originLabel: "Starting point",
    origin: "Monolith",
    migration: "Migration",
    destinationLabel: "Cloud microservices",
    stages: ["Booking API", "Cloud services"]
  }
} as const;
