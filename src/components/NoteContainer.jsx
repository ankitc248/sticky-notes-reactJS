import { Note } from "./Note";
export const NoteContainer = ({
  notes,
  setPopupValues,
  setNotePopup,
  handleNoteSave,
}) => {
  return (
    <div className="notes-container">
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
