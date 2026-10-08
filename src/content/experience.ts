import {workExperiences, type Experience} from "./portfolio";

type YearMonth = `${number}-${number}`;
type RolePeriod = {
  id: string;
  startMonth: YearMonth;
  endMonth: YearMonth | null;
  contribution?: string;
};

export type CareerRole = Pick<
  Experience,
  "company" | "role" | "date" | "desc" | "descBullets"
> &
  RolePeriod;

const periods: Record<string, RolePeriod> = {
  "H-E-B|Sr. Software Engineer": {
    id: "heb",
    startMonth: "2023-07",
    endMonth: null,
    contribution:
      "Help build event-driven notifications for curbside and order communications."
  },
  "T-Mobile|Software Engineer": {
    id: "t-mobile",
    startMonth: "2021-07",
    endMonth: "2023-07",
    contribution:
      "Delivered billing, payments, and invoicing capabilities for business customers."
  },
  "USAA|Software Engineer": {
    id: "usaa",
    startMonth: "2019-07",
    endMonth: "2021-07",
    contribution:
      "Built real-time identity verification and tools to help prevent fraud."
  },
  "American Airlines|Software Engineer": {
    id: "american-airlines",
    startMonth: "2018-05",
    endMonth: "2019-07",
    contribution:
      "Helped move flight booking from a monolith to cloud-hosted microservices."
  },
  "UTx @ The University of Texas System|Software Engineer Intern": {
    id: "ut-system",
    startMonth: "2016-05",
    endMonth: "2016-08"
  },
  "TIAER|Software Engineer": {
    id: "tiaer-engineer",
    startMonth: "2016-02",
    endMonth: "2018-05"
  },
  "TIAER|Associate Software Engineer": {
    id: "tiaer-associate",
    startMonth: "2015-02",
    endMonth: "2016-02"
  }
};

export const careerRoles: readonly CareerRole[] =
  workExperiences.experience.map(role => {
    const period = periods[`${role.company}|${role.role}`];
    if (!period) throw new Error("Career role is missing its calendar dates.");
    return {...role, ...period};
  });

export function monthIndex(value: YearMonth): number {
  const [year, month] = value.split("-").map(Number);
  return year * 12 + month - 1;
}

export const careerCalendar = {
  startMonth: Math.min(...careerRoles.map(role => monthIndex(role.startMonth))),
  endMonth: __BUILD_YEAR__ * 12 + __BUILD_MONTH__ + 1
} as const;

export const experienceCopy = {
  title: "Experience.",
  description:
    "Backend platforms, customer journeys, and the tools that support them.",
  rolesLabel: "Career history",
  detailsLabel: "Role details",
  technologyLabel: "Technology and tools",
  presentLabel: "Now",
  overlapNote:
    "Some roles overlap. The UT System internship took place during my time at TIAER."
} as const;
