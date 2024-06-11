import "./App.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

export default function App() {
  const [notePopup, setNotePopup] = useState(false);
  const [popupValues, setPopupValues] = useState({});
  const [organizedNotes, setOrganizedNotes] = useState({
    pending: [],
    completed: [],
    archived: [],
  });
  const helpNote = {
    id: uuidv4(),
    title: "Sticky note features",
    text: [
      "You can add upto 5 points to a single sticky note",
      "Available in 4 colors",
      "Has a 200 character limit",
      "Fold a note to favorite it",
      "Hover over a task to mark it complete individually",
    ],
    textStatus: [false, false, false, false, false],
    color: "yellow",
    type: "pending",
  };

  const [config, setConfig] = useState(() => {
    if (localStorage.getItem("config"))
      return JSON.parse(localStorage.getItem("config"));
    return { foldedDisplay: false, listDisplay: false, handwrittenNote: true };
  });

  const [notes, setNotes] = useState(() => {
    if (localStorage.getItem("notes"))
      return JSON.parse(localStorage.getItem("notes"));
    return [helpNote];
  });

  const handleNoteSave = (data) => {
    data.lastModifiedDateTime = new Date();
    setNotePopup(false);
    if (data.type === "deleted")
      setNotes((prevNotes) => [
        ...prevNotes.filter((note) => note.id !== data.id),
      ]);
    if (notes.some((note) => note.id === data.id)) {
      let tempNotes = [...notes];
      tempNotes = tempNotes.map((note) => (note.id === data.id ? data : note));
      setNotes(tempNotes);
    } else setNotes((prevNotes) => [...prevNotes, data]);
    setConfig((prevConfig) => ({ ...prevConfig, foldedDisplay: false }));
  };

  useEffect(() => {
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) setNotes(JSON.parse(storedNotes));
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    notes.length &&
      setOrganizedNotes({
        pending: notes.filter((note) => note.type === "pending"),
        completed: notes.filter((note) => note.type === "completed"),
        archived: notes.filter((note) => note.type === "archived")
      });
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("config", JSON.stringify(config));
  }, [config]);
  return (
    <div
      className={`App ${!config.handwrittenNote ? "not-handwritten" : ""} ${
        config.listDisplay ? "list" : ""
      } ${config.foldedDisplay ? "folded-only" : ""}`}
    >
      {notePopup && (
        <NoteEditor
          values={popupValues}
          onSaveClick={handleNoteSave}
          onCloseClick={() => setNotePopup(false)}
        />
      )}
      <div className="app-container">
        <div className="add-note-container">
          <div className="universal-controls">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`handwritten-toggle ${
                config.handwrittenNote ? "active" : ""
              }`}
              onClick={() => {
                setConfig({
                  ...config,
                  handwrittenNote: !config.handwrittenNote,
                });
              }}
            >
              <span className="button-icon"><img src="assets/note-icons/icon-of-a-hand-holding-a-pencil.svg" alt='handwritten' className="icon svg"/></span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`folded-toggle ${
                config.foldedDisplay ? "active" : ""
              }`}
              onClick={() => {
                setConfig({ ...config, foldedDisplay: !config.foldedDisplay });
              }}
            >
              <img src="assets/note-icons/page-with-corner-folded.svg" alt='folded' className="icon svg"/>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`list-toggle ${config.listDisplay ? "active" : ""}`}
              onClick={() => {
                setConfig({ ...config, listDisplay: !config.listDisplay });
              }}
            >
              <img src="assets/note-icons/burger-simple.svg" alt='stretch' className="icon svg"/>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.975 }}
              type="button"
              className="add-note-button"
              onClick={() => {
                setPopupValues({});
                setNotePopup(true);
              }}
            >
              <span className="button-icon">&#x2b;</span>
              <span className="button-text"> Add sticky note</span>
            </motion.button>
          </div>
        </div>
        {(Object.keys(organizedNotes).length && !organizedNotes.pending.length && !organizedNotes.completed.length && !organizedNotes.archived.length) ? (
          <div className="empty-notes">No notes added yet
          <p>
            <motion.button
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.975 }}
              type="button"
              className="add-note-button"
              onClick={() => {
                setPopupValues({});
                setNotePopup(true);
              }}
            >
              <span className="button-icon">&#x2b;</span>
              <span className="button-text"> Stick one now</span>
            </motion.button></p></div>
        ):null}
        {Object.keys(organizedNotes).length ? (
          <div className="notes-sections">
            {organizedNotes.pending.length ? (
              <div className="notes-section pending">
                <div className="notes-header">
                  <motion.div
                    className="notes-header-title"
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h1>Pending tasks</h1>
                  </motion.div>
                </div>
                <div className="notes-container">
                  {organizedNotes.pending.map((note) => (
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
              </div>
            ) : null}
            {organizedNotes.completed.length ? (
              <div className="notes-section completed">
                <div className="notes-header">
                  <motion.div
                    className="notes-header-title"
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h1>Completed tasks</h1>
                  </motion.div>
                </div>
                <div className="notes-container">
                  {organizedNotes.completed.map((note) => (
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
              </div>
            ) : null}
            {organizedNotes.archived.length ? (
              <div className="notes-section archived">
                <div className="notes-header">
                  <motion.div
                    className="notes-header-title"
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h1>Archived</h1>
                  </motion.div>
                </div>
                <div className="notes-container">
                  {organizedNotes.archived.map((note) => (
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
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const Note = ({ values, onEditClick, onUpdate }) => {
  const [noteColor, setNoteColor] = useState(values.color);
  const [folded, setFolded] = useState(values.folded);
  const [textStatus, setTextStatus] = useState(values.textStatus);
  const [noteType, setNoteType] = useState(values.type);
  const noteColors = ["yellow", "green", "blue", "pink"];
  const handleTextStatusUpdate = (index) => {
    let tempTextStatus = textStatus;
    tempTextStatus[index] = !tempTextStatus[index];
    setTextStatus(tempTextStatus);
    onUpdate(values);
  };

  useEffect(() => {
    values.color = noteColor;
    values.folded = folded;
    values.textStatus = textStatus;
    values.type = noteType;
  }, [values, noteColor, folded, textStatus, noteType]);

  return (
    <motion.div
      className={`note ${noteColor} ${folded ? "folded" : ""}`}
      initial={{ scale: 1.1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.5, ease: "easeInOut" }}
    >
      <div className="note-footer for-horizontal">
        <div className="note-colors">
          {noteColors.map((color) => (
            <button
              key={color}
              type="button"
              className={`note-color ${color}`}
              onClick={() => {
                setNoteColor(color);
                onUpdate(values);
              }}
            ></button>
          ))}
        </div>
        </div>
      <div className="note-body">
      <button
        className="note-fold"
        onClick={() => {
          setFolded(!folded);
          onUpdate(values);
        }}
      ></button>
        <p className="note-title">{values.title}</p>
        <ul className="note-tasks">
          {values.text.map((text, index) => (
            <li
              className={`note-task ${textStatus[index] ? "done" : ""}`}
              key={index}
              onClick={() => {
                handleTextStatusUpdate(index);
              }}
            >
              {text}
            </li>
          ))}
        </ul>
      </div>
      <div className="note-footer">
        <div className="note-colors">
          {noteColors.map((color) => (
            <button
              key={color}
              type="button"
              className={`note-color ${color}`}
              onClick={() => {
                setNoteColor(color);
                onUpdate(values);
              }}
            ></button>
          ))}
        </div>
        <div className="note-controls">
          <button
            type="button"
            className="note-control note-control-edit"
            onClick={() => {
              onEditClick();
            }}
          >
            <span className="button-icon"><img src="assets/note-icons/edit-2.svg" className="icon svg" alt="edit" style={{maxWidth: "18px"}}/></span>
            <span className="button-tooltip">Edit</span>
          </button>
          <button
            type="button"
            className="note-control note-control-undo"
            onClick={() => {
              setNoteType("pending");
              onUpdate(values);
            }}
          >
            <span className="button-icon"><img src="assets/note-icons/undo.svg" className="icon svg" alt="undo"/></span>
            <span className="button-tooltip">Mark pending</span>
          </button>
          <button
            type="button"
            className="note-control note-control-delete"
            onClick={() => {
              setNoteType("deleted");
              onUpdate(values);
            }}
          >
            <span className="button-icon"><img src="assets/note-icons/delete-1.svg" className="icon svg" alt="delete"/></span>
            <span className="button-tooltip">Delete</span>
          </button>
          <button
            type="button"
            className="note-control note-control-archive"
            onClick={() => {
              setNoteType("archived");
              onUpdate(values);
            }}
          >
            <span className="button-icon"><img src="assets/note-icons/archive.svg" className="icon svg" alt="archive"/></span>
            <span className="button-tooltip">Archive</span>
          </button>
          <button
            type="button"
            className="note-control note-control-complete"
            onClick={() => {
              setNoteType("completed");
              onUpdate(values);
            }}
          >
            <span className="button-icon"><img src="assets/note-icons/check.svg" className="icon svg" alt="complete"/></span>
            <span className="button-tooltip">Mark complete</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const NoteEditor = ({ values, onSaveClick, onCloseClick }) => {
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
