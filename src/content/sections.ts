export const sections = [
  {key: "overview", id: "greeting", title: "Overview"},
  {key: "systems", id: "systems", title: "Selected systems"},
  {key: "experience", id: "experience", title: "Experience"},
  {key: "notes", id: "notes", title: "Engineering notes"},
  {key: "personal", id: "off-the-clock", title: "Off the clock"},
  {key: "builds", id: "achievements", title: "Earlier builds"},
  {key: "education", id: "education", title: "Education"},
  {key: "contact", id: "contact", title: "Contact"}
] as const;
export type SectionKey = (typeof sections)[number]["key"];
export function sectionLabel(key: SectionKey): string {
  const index = sections.findIndex(section => section.key === key);
  return `${String(index + 1).padStart(2, "0")} / ${sections[index].title.toUpperCase()}`;
}
export const navigation = [
  {label: "Overview", href: "#greeting"},
  {label: "Systems", href: "#systems"},
  {label: "Experience", href: "#experience"},
  {label: "Contact", href: "#contact"}
] as const;
