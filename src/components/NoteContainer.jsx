import { Note } from "./Note";
import { useDroppable } from "@dnd-kit/core";
export const NoteContainer = ({
  type,
  notes,
  setPopupValues,
  setNotePopup,
  handleNoteSave
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `${type}-note-container`,
  });
  return (
    <div
      className="notes-container"
      ref={setNodeRef}
    >
      {notes.map((note) => (
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
