export const traceStages = [
  {
    id: "client",
    label: "Client",
    icon: "M5 3h14v13H5z M3 20h18 M9 16v4m6-4v4"
  },
  {
    id: "gateway",
    label: "API gateway",
    icon: "M4 14h16v6H4z M8 17h.01M12 17h.01 M12 14V5 M8 8l4-4 4 4"
  },
  {
    id: "auth",
    label: "Auth",
    icon: "M12 3 20 6v6c0 5-8 9-8 9s-8-4-8-9V6z M8.5 12l2.5 2.5 4.5-5"
  },
  {
    id: "service",
    label: "Service",
    icon: "M4 3h16v7H4z M4 14h16v7H4z M7 6.5h.01M7 17.5h.01 M11 6.5h6m-6 11h6"
  },
  {
    id: "data",
    label: "Database / cache",
    icon: "M20 6c0 1.7-3.6 3-8 3S4 7.7 4 6s3.6-3 8-3 8 1.3 8 3ZM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"
  },
  {
    id: "queue",
    label: "Queue",
    icon: "M4 4h16v4H4z M4 10h16v4H4z M4 16h16v4H4z"
  }
] as const;

export const traceCopy = {
  title: "Request path",
  annotation: "Illustrative",
  description:
    "An illustrative request moves from a client through an API gateway, authentication, a service, a database or cache, and a queue. The waterfall below shows the order and overlap of these stages, without measured durations.",
  waterfall: "Span waterfall",
  direction: "Request → work",
  note: "From request to background work."
} as const;
