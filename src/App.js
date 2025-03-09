import "./App.css";
import { useEffect, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { NoteEditor } from "./components/NoteEditor/NoteEditor";
import { NoteSection } from "./components/NoteSection";
import { UniversalControls } from "./components/UniversalControls";
import { EmptyIndicator } from "./components/EmptyIndicator";
import { arrayMove } from "@dnd-kit/sortable";

const helpNote = {
  id: uuidv4(),
  title: "Sticky note features",
  text: [
    "You can add upto 5 points to a single sticky note",
    "Drag and drop from bottom to change position of notes",
    "Has a 200 character limit",
    "Fold a note to favorite it",
    "Hover over a task to mark it complete individually",
  ],
  textStatus: [false, false, false, false, false],
  color: "yellow",
  type: "pending",
};

export default function App() {
  const [notePopup, setNotePopup] = useState(false);
  const [popupValues, setPopupValues] = useState({});

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

  const handleNoteSave = useCallback(
    (data) => {
      data.lastModifiedDateTime = new Date();
      setNotePopup(false);
      if (data.type === "deleted")
        setNotes((prevNotes) => [
          ...prevNotes.filter((note) => note.id !== data.id),
        ]);
      if (notes.some((note) => note.id === data.id)) {
        let tempNotes = [...notes];
        tempNotes = tempNotes.map((note) =>
          note.id === data.id ? data : note
        );
        setNotes(tempNotes);
      } else {
        if (config.foldedDisplay) data.folded = true;
        setNotes((prevNotes) => [...prevNotes, data]);

        // Scroll to the last added note
        setTimeout(() => {
          const noteType = data.type;
          const lastNote = document.querySelector(
            `.notes-section.${noteType} .note:last-child`
          );
          if (lastNote) {
            lastNote.scrollIntoView({ behavior: "smooth", block: "end" });
          }
        }, 0);
      }
    },
    [notes, config]
  );

  useEffect(() => {
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) setNotes(JSON.parse(storedNotes));
  }, []);

  const [organizedNotes, setOrganizedNotes] = useState({
    pending: notes.filter((note) => note.type === "pending"),
    completed: notes.filter((note) => note.type === "completed"),
    archived: notes.filter((note) => note.type === "archived"),
  });

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    notes.length &&
      setOrganizedNotes({
        pending: notes.filter((note) => note.type === "pending"),
        completed: notes.filter((note) => note.type === "completed"),
        archived: notes.filter((note) => note.type === "archived"),
      });
      // console.log("notes", notes);
  }, [notes]);
  
  // useEffect(() => {
  //   console.log("organizedNotes", organizedNotes);
  // }, [organizedNotes]);


  useEffect(() => {
    localStorage.setItem("config", JSON.stringify(config));
  }, [config]);

  const handleNoteReorder = useCallback(
    (data) => {
      const oldIndex = notes.findIndex((note) => {
        return note.id === data[0];
      });
      const newIndex = notes.findIndex((note) => {
        return note.id === data[1];
      });
      if (oldIndex === -1 || newIndex === -1) return;
      let newNotes = arrayMove(notes, oldIndex, newIndex);
      setNotes(newNotes);
    },
    [notes]
  );

  const handleExportNotes = useCallback(() => {
    const notesData = JSON.stringify(notes, null, 2);
    const blob = new Blob([notesData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const link = document.createElement('a');
    link.href = url;
    link.download = `sticky-notes-${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [notes]);

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
          handleExportNotes={handleExportNotes}
          setNotes = {setNotes}
          notes={notes}
        />
        {!organizedNotes.pending.length &&
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
                onNoteReorder={handleNoteReorder}
                type="pending"
                notes={organizedNotes.pending}
                setPopupValues={setPopupValues}
                setNotePopup={setNotePopup}
                handleNoteSave={handleNoteSave}
                config={config}
              />
            ) : null}
            {organizedNotes.completed.length ? (
              <NoteSection
                onNoteReorder={handleNoteReorder}
                type="completed"
                notes={organizedNotes.completed}
                setPopupValues={setPopupValues}
                setNotePopup={setNotePopup}
                handleNoteSave={handleNoteSave}
                config={config}
              />
            ) : null}
            {organizedNotes.archived.length ? (
              <NoteSection
                onNoteReorder={handleNoteReorder}
                type="archived"
                notes={organizedNotes.archived}
                setPopupValues={setPopupValues}
                setNotePopup={setNotePopup}
                handleNoteSave={handleNoteSave}
                config={config}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}