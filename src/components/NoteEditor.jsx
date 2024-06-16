import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { Note } from "./Note";
export const NoteEditor = ({ values, onSaveClick, onCloseClick }) => {
  const maxCharacters = 200;
  const maxLines = 5;
  const [noteID] = useState(values.id || uuidv4());
  const [noteTitle, setNoteTitle] = useState(values.title || "");
  const [noteText, setNoteText] = useState(values.text || []);
  const [noteColor, setNoteColor] = useState(values.color || "yellow");
  const [textStatus, setTextStatus] = useState(values.textStatus || []);
  const [createdDateTime] = useState(values.createdDateTime || new Date());
  const [lastModifiedDateTime, setLastModifiedDateTime] = useState(
    values.lastModifiedDateTime || new Date()
  );
  const [characterLeft, setCharacterLeft] = useState(() => {
    if (Object.keys(values).length)
      return maxCharacters - values.text.join("\n").length;
    return maxCharacters;
  });
  let noteProperties = {
    id: noteID,
    title: noteTitle,
    text: noteText,
    textStatus: textStatus,
    color: noteColor,
    type: "pending",
    folded: false,
    createdDateTime: createdDateTime,
    lastModifiedDateTime: lastModifiedDateTime,
  };
  const handleNoteUpdate = (data) => {
    setNoteColor(data.color);
  };

  const handleKeyInput = (e) => {
    if (!characterLeft) {
      if (e.key !== "Backspace") e.preventDefault();
    }
    if (e.key === "Enter") {
      if (noteText.length === maxLines) {
        e.preventDefault();
      }
    }
  };

  const handleTextInput = (e) => {
    const inputText = e.target.value;
    if (inputText === "") setNoteText([]);
    else {
      const newLineIndex = inputText.indexOf("\n");
      if (newLineIndex >= 0) {
        const lines = inputText.split("\n");
        setNoteText(lines);
      } else {
        if (inputText !== "") setNoteText([inputText]);
      }
    }
    setCharacterLeft(maxCharacters - e.target.value.length);
  };

  useEffect(() => {
    setTextStatus(Array(noteText.length).fill(false));
  }, [noteText]);

  return (
    <div
      className={`note-editor-container ${
        Object.keys(values).length ? "editing" : "new"
      }`}
    >
      <div className="note-editor-background" onClick={onCloseClick}></div>
      <motion.div
        className="note-editor"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="note-editor-title">
          <div className="note-editor-title-text">
            {!Object.keys(values).length ? "Adding new note" : "Editing note"}
          </div>
          <div className="note-editor-controls">
            <button
              type="button"
              className="note-editor-close"
              onClick={onCloseClick}
            >
              &#x2716;
            </button>
            <button
              type="button"
              className="note-editor-save"
              onClick={
                noteText.length && noteTitle
                  ? () => {
                      onSaveClick(noteProperties);
                    }
                  : null
              }
            >
              {!Object.keys(values).length ? "+ Stick note" : "Save changes"}
            </button>
          </div>
        </div>
        <div className="note-editor-body">
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
              <span
                className={`character-count ${!characterLeft ? "red" : ""}`}
              >
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
          <div className="note-preview">
            <Note
              key={noteProperties.id}
              values={noteProperties}
              onUpdate={handleNoteUpdate}
            />
          </div>
        </div>
        <div className="note-editor-footer">
          <div className="footer-buttons">
            <motion.button
              type="button"
              className="note-editor-close"
              onClick={onCloseClick}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="button"
              className="note-editor-save"
              onClick={
                noteText.length && noteTitle
                  ? () => {
                      onSaveClick(noteProperties);
                    }
                  : null
              }
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
            >
              {!Object.keys(values).length ? "+ Stick note" : "Save changes"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
