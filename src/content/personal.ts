export type PersonalInterest = {
  id: "boxing" | "travel" | "photography" | "fitness" | "cars";
  label: string;
};

export const personalCopy = {
  display: false, // Set true when the personal photos are ready.
  title: "Off the clock.",
  photoStatus: "Photo pending"
} as const;

export const personalInterests = [
  {id: "boxing", label: "Boxing"},
  {id: "travel", label: "Travel"},
  {id: "photography", label: "Photography"},
  {id: "fitness", label: "Fitness"},
  {id: "cars", label: "Cars"}
] as const satisfies readonly PersonalInterest[];
