export type EngineeringNote = {
  id: "burn-rate-alerting" | "aurora-migration" | "runbooks";
  title: string;
  technologies: readonly string[];
  problem: string;
  approach: string;
  result: string;
  publicationNote: string | null;
};

export const notesCopy = {
  title: "Engineering notes.",
  introduction: "A few problems, the work behind them, and what changed.",
  pendingLabel: "Pending confirmation"
} as const;

export const noteStages = [
  {key: "problem", label: "Problem"},
  {key: "approach", label: "Approach"},
  {key: "result", label: "Result"}
] as const;

export const engineeringNotes = [
  {
    id: "burn-rate-alerting",
    title: "SLO burn-rate alerting as code",
    technologies: ["Datadog", "Terraform"],
    problem:
      "Catch fast failures and sustained degradation without paging twice for the same incident.",
    approach:
      "Implemented fast, medium, and slow multi-window burn-rate tiers from the Google SRE Workbook in Datadog via Terraform across three services. Composite monitors keep overlapping tiers from creating duplicate pages.",
    result:
      "Fixed a threshold-resolution bug caused by mismatched severity strings.",
    publicationNote: null
  },
  {
    id: "aurora-migration",
    title: "RDS MySQL → Aurora MySQL",
    technologies: ["Aurora MySQL (Serverless v2)", "AWS JDBC wrapper"],
    problem:
      "Move the data tier from RDS MySQL to Aurora MySQL, including the application’s database connection.",
    approach: "Migration work included wiring the AWS JDBC wrapper.",
    result: "Results are pending confirmation.",
    publicationNote:
      "Migration scope, authorship, and measured results are pending confirmation."
  },
  {
    id: "runbooks",
    title: "Runbooks juniors can follow",
    technologies: ["Runbooks", "RCAs"],
    problem:
      "On-call responders may need to diagnose an unfamiliar scheduler error with little context.",
    approach:
      "Wrote plain-language runbooks and RCAs. A scheduler-error diagnostic runbook walks responders through the checks and next steps.",
    result:
      "A diagnostic path responders can follow without already knowing the service.",
    publicationNote: null
  }
] as const satisfies readonly EngineeringNote[];
