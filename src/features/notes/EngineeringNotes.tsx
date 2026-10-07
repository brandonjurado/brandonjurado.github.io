import {engineeringNotes, notesCopy, noteStages} from "../../content/notes";
import SectionHeading from "../../components/sectionHeading/SectionHeading";
import "./EngineeringNotes.scss";

export default function EngineeringNotes() {
  return (
    <section
      className="engineering-notes"
      id="notes"
      aria-labelledby="notes-heading"
    >
      <SectionHeading
        sectionKey="notes"
        headingId="notes-heading"
        title={notesCopy.title}
        description={notesCopy.introduction}
      />
      <ol className="engineering-notes-list" role="list">
        {engineeringNotes.map(note => (
          <li key={note.id}>
            <article
              className="engineering-note"
              aria-labelledby={`note-${note.id}`}
            >
              <header className="engineering-note-heading">
                <h3 id={`note-${note.id}`}>{note.title}</h3>
                <p>{note.technologies.join(" · ")}</p>
              </header>
              <div className="engineering-note-body">
                <dl>
                  {noteStages.map(stage => (
                    <div className="engineering-note-stage" key={stage.key}>
                      <dt>{stage.label}</dt>
                      <dd>{note[stage.key]}</dd>
                    </div>
                  ))}
                </dl>
                {note.publicationNote && (
                  <p className="engineering-note-pending">
                    <span>{notesCopy.pendingLabel}</span>
                    {note.publicationNote}
                  </p>
                )}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
