import PropTypes from "prop-types";
import { maxLines } from "./NoteEditor";
export const NoteInputs = ({
  noteProperties,
  characterLeft,
  setNoteTitle,
  handleKeyInput,
  handleTextInput,
}) => {
  return (
    <div className="note-inputs">
      <div className="note-title-input-container">
        <input
          autoFocus
          type="text"
          placeholder="Note title"
          className="note-title-input"
          onChange={(e) => setNoteTitle(e.target.value)}
          value={noteProperties.title}
        />
      </div>
      <div className="note-text-input-container">
        <textarea
          className="note-textarea"
          placeholder="Fill the note with upto 5 tasks"
          onChange={handleTextInput}
          onKeyDown={handleKeyInput}
          value={noteProperties.text.join("\n")}
        ></textarea>
        <div className="task-input-indicators">
          <span
            className={
              "task-count-label " +
              (maxLines - noteProperties.text.length <= 0 ? " red" : "")
            }
          >
            <img
              src="assets/note-icons/list-ul.svg"
              width={28}
              height={28}
              alt="tasks left"
              className="svg icon"
            />
            {maxLines - noteProperties.text.length}
          </span>
          <span className={`character-count ${!characterLeft ? "red" : ""}`}>
            <img
              src="assets/note-icons/textformat-abc.svg"
              width={28}
              height={28}
              alt="character left"
              className="svg icon"
            />
            {characterLeft}
          </span>
        </div>
      </div>
    </div>
  );
};

NoteInputs.propTypes = {
  noteProperties: PropTypes.object,
  characterLeft: PropTypes.number,
  setNoteTitle: PropTypes.func,
  handleKeyInput: PropTypes.func,
  handleTextInput: PropTypes.func,
};
