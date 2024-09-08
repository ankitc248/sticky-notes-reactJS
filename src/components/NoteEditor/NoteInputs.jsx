import PropTypes from "prop-types";
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
        <span className={`character-count ${!characterLeft ? "red" : ""}`}>
          {characterLeft}
        </span>
        <textarea
          className="note-textarea"
          placeholder="Fill the note with points and details"
          onChange={handleTextInput}
          onKeyDown={handleKeyInput}
          value={noteProperties.text.join("\n")}
        ></textarea>
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
