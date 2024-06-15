import "./App.css";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { NoteEditor } from "./components/NoteEditor";
import { NoteSection } from "./components/NoteSection";
import { UniversalControls } from "./components/UniversalControls";
import { EmptyIndicator } from "./components/EmptyIndicator";

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
        archived: notes.filter((note) => note.type === "archived"),
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
        <UniversalControls
          config={config}
          setConfig={setConfig}
          setNotePopup={setNotePopup}
          setPopupValues={setPopupValues}
        />
        {Object.keys(organizedNotes).length &&
        !organizedNotes.pending.length &&
        !organizedNotes.completed.length &&
        !organizedNotes.archived.length ? (
          <EmptyIndicator
            setPopupValues={setPopupValues}
            setNotePopup={setNotePopup}
          />
        ) : null}
        {Object.keys(organizedNotes).length ? (
          <div className="notes-sections">
            {organizedNotes.pending.length ? (
              <NoteSection
                type="pending"
                notes={organizedNotes.pending}
                setPopupValues={setPopupValues}
                setNotePopup={setNotePopup}
                handleNoteSave={handleNoteSave}
              />
            ) : null}
            {organizedNotes.completed.length ? (
              <NoteSection
                type="completed"
                notes={organizedNotes.completed}
                setPopupValues={setPopupValues}
                setNotePopup={setNotePopup}
                handleNoteSave={handleNoteSave}
              />
            ) : null}
            {organizedNotes.archived.length ? (
              <NoteSection
                type="archived"
                notes={organizedNotes.archived}
                setPopupValues={setPopupValues}
                setNotePopup={setNotePopup}
                handleNoteSave={handleNoteSave}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
