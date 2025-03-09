import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { Note } from "../Note";
import { NoteInputs } from "./NoteInputs";
import { NoteEditorFooter } from "./NoteEditorFooter";
export const maxCharacters = 200;
export const maxLines = 5;

export const NoteEditor = ({ values, onSaveClick, onCloseClick }) => {
  const [noteID] = useState(values.id || uuidv4());
  const [noteTitle, setNoteTitle] = useState(values.title || "");
  const [noteText, setNoteText] = useState(values.text || []);
  const [noteColor, setNoteColor] = useState(values.color || "yellow");
  const [textStatus, setTextStatus] = useState(values.textStatus || []);
  const [createdDateTime] = useState(values.createdDateTime || new Date());
  const lastModifiedDateTime = values.lastModifiedDateTime || new Date();
  const [characterLeft, setCharacterLeft] = useState(() => {
    if (Object.keys(values).length)
      return maxCharacters - values.text.join("\n").length;
    return maxCharacters;
  });

  const noteProperties = {
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
    setTextStatus(data.textStatus);
  };

  const handleKeyInput = (e) => {
    if (!characterLeft || noteText.length >= maxLines + 1) {
      if (e.key !== "Backspace") e.preventDefault();
    }
    if (e.key === "Enter") {
      const inputText = e.target.value;
      const newLineIndex = inputText.indexOf("\n");
      if (inputText.trim() === "") e.preventDefault();
      if (newLineIndex >= 0) {
        const lines = inputText.split("\n");
        if (lines[lines.length - 1] === "") {
          e.preventDefault();
        }
      }
      if (noteText.length >= maxLines) {
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
        setNoteText([inputText]);
      }
    }
    setCharacterLeft(maxCharacters - e.target.value.length);
  };

  const remapTextStatus = useCallback(() => {
    let oldTasksThatAreDone = [];
    if (values.textStatus !== undefined) {
      values.textStatus.forEach((status, index) => {
        if (status) oldTasksThatAreDone.push(values.text[index]);
      });
    }
    let newTextStatus = [];
    noteText.forEach((task) => {
      if (oldTasksThatAreDone.includes(task)) newTextStatus.push(true);
      else newTextStatus.push(false);
    });
    return newTextStatus;
  }, [noteText, values.textStatus, values.text]);

  useEffect(() => {
    if (!Object.keys(values).length)
      setTextStatus(Array(noteText.length).fill(false));
    else {
      let newTextStatus = remapTextStatus();
      setTextStatus(newTextStatus);
    }
  }, [noteText, values, remapTextStatus]);

  return (
    <div
      className={`note-editor-container ${
        Object.keys(values).length ? "editing" : "new"
      }`}
    >
      <div
        className="note-editor-background"
        onClick={onCloseClick}
        role="button"
        tabIndex={0}
      ></div>
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
              
          <span className="button-icon">
            <img
              src="assets/note-icons/pencil-slash.svg"
              alt="handwritten"
              className="icon svg"
            />
          </span>
            </button>
            <button
              type="button"
              className="note-editor-save"
              onClick={
                noteText.length && noteTitle.length
                  ? () => onSaveClick(noteProperties)
                  : null
              }
            >
              {!Object.keys(values).length ? "+ Stick note" : "Save changes"}
            </button>
          </div>
        </div>
        <div className="note-editor-body">
          <NoteInputs
            noteProperties={noteProperties}
            characterLeft={characterLeft}
            setNoteTitle={setNoteTitle}
            handleKeyInput={handleKeyInput}
            handleTextInput={handleTextInput}
          />
          <div className="note-preview">
            <Note
              key={noteProperties.id}
              values={noteProperties}
              onUpdate={handleNoteUpdate}
            />
          </div>
        </div>
        <NoteEditorFooter
          onSaveClick={onSaveClick}
          onCloseClick={onCloseClick}
          noteText={noteText}
          noteTitle={noteTitle}
          values={values}
          noteProperties={noteProperties}
        />
      </motion.div>
    </div>
  );
};

NoteEditor.propTypes = {
  values: PropTypes.object,
  onSaveClick: PropTypes.func,
  onCloseClick: PropTypes.func,
};
