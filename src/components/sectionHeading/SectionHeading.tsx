import {sectionLabel, type SectionKey} from "../../content/sections";
import "./SectionHeading.scss";

type Props = {
  sectionKey: SectionKey;
  headingId: string;
  title: string;
  description?: string;
};

export default function SectionHeading({
  sectionKey,
  headingId,
  title,
  description
}: Props) {
  return (
    <header className="section-heading">
      <p className="section-heading__eyebrow">{sectionLabel(sectionKey)}</p>
      <h2 id={headingId}>{title}</h2>
      {description && (
        <p className="section-heading__description">{description}</p>
      )}
    </header>
  );
}
