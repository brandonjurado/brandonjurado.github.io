import {type SectionKey} from "../../content/sections";
import "./SectionHeading.scss";

type Props = {
  sectionKey: SectionKey;
  headingId: string;
  title: string;
  description?: string;
};

export default function SectionHeading({headingId, title, description}: Props) {
  return (
    <header className="section-heading">
      <h2 id={headingId}>{title}</h2>
      {description && (
        <p className="section-heading__description">{description}</p>
      )}
    </header>
  );
}
