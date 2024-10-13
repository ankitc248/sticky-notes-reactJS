import { Note } from "./Note";
import { useDroppable } from "@dnd-kit/core";
import PropTypes from "prop-types";
export const NoteContainer = ({
  type,
  notes,
  setPopupValues,
  setNotePopup,
  handleNoteSave,
  config,
}) => {
  const { setNodeRef } = useDroppable({
    id: `${type}-note-container`,
  });
  return (
    <div className="notes-container" ref={setNodeRef}>
      {notes.filter((note) => !(!note.folded && config.foldedDisplay))
        .length === 0 && (
        <div className="empty-folded-notes">
          <span className="heading">No folded notes</span>
          <span className="description">
            You can fold a note from the top right corner
          </span>
        </div>
      )}
      {notes
        .filter((note) => !(!note.folded && config.foldedDisplay))
        .map((note) => (
          <Note
            key={note.id}
            values={note}
            onEditClick={() => {
              setPopupValues(note);
              setNotePopup(true);
            }}
            onUpdate={handleNoteSave}
          />
        ))}
    </div>
  );
};

NoteContainer.propTypes = {
  type: PropTypes.string.isRequired,
  notes: PropTypes.array.isRequired,
  setPopupValues: PropTypes.func.isRequired,
  setNotePopup: PropTypes.func.isRequired,
  handleNoteSave: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
};
