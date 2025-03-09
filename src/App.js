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
  }, [notes]);

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

  const handleImportNotes = useCallback((fileInputRef) => {
    const file = fileInputRef.current?.files[0];
    if (!file) return;
    
    // Check file type
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      alert('Please select a valid JSON file');
      fileInputRef.current.value = '';
      return;
    }

    if (file.size > maxImportFileSize) {
      alert('File is too large. Please select a file under 50MB');
      fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    let hasAlerted = false;  // Add flag to track if alert has been shown
    
    reader.onload = (e) => {
      try {
        const importedNotes = JSON.parse(e.target.result);
        
        // Validate imported data structure
        if (!Array.isArray(importedNotes)) {
          throw new Error('Invalid notes format: Expected an array');
        }

        // Validate each note has required fields
        const isValidNote = (note) => {
          return (
            note &&
            typeof note === 'object' &&
            typeof note.id === 'string' &&
            note.lastModifiedDateTime &&
            Array.isArray(note.text) &&
            Array.isArray(note.textStatus) &&
            typeof note.type === 'string'
          );
        };

        if (!importedNotes.every(isValidNote)) {
          throw new Error('Invalid note format: One or more notes are missing required fields');
        }

        let stats = {
          added: 0,
          updated: 0,
          skipped: 0
        };

        setNotes(prevNotes => {
          const updatedNotes = [...prevNotes];
          
          importedNotes.forEach(importedNote => {
            const existingNoteIndex = updatedNotes.findIndex(note => note.id === importedNote.id);
            
            if (existingNoteIndex === -1) {
              // Note doesn't exist, add it
              updatedNotes.push(importedNote);
              stats.added++;
              console.log("Note added with id: ", importedNote.id);
            } else {
              // Note exists, check timestamp
              const existingNote = updatedNotes[existingNoteIndex];
              const existingTime = new Date(existingNote.lastModifiedDateTime).getTime();
              const importedTime = new Date(importedNote.lastModifiedDateTime).getTime();
              
              if (importedTime > existingTime) {
                // Imported note is newer, replace existing note
                updatedNotes[existingNoteIndex] = importedNote;
                stats.updated++;
                console.log("Note updated with id: ", importedNote.id);
              } else {
                stats.skipped++;
                console.log("Note skipped with id: ", importedNote.id);
              }
            }
          });
          
          // Only show alert if it hasn't been shown yet
          if (!hasAlerted) {
            alert(`Import successful!\n\nNotes added: ${stats.added}\nNotes updated: ${stats.updated}\nNotes skipped: ${stats.skipped}`);
            fileInputRef.current.value = '';
            hasAlerted = true;
          }
          
          return updatedNotes;
        });
        
      } catch (error) {
        console.error('Error importing notes:', error);
        alert(`Error importing notes: ${error.message}`);
        fileInputRef.current.value = '';
      }
    };

    reader.onerror = () => {
      alert('Error reading file');
    };

    reader.readAsText(file);
  }, [setNotes]);

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
          handleImportNotes={handleImportNotes}
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

const maxImportFileSize = 50 * 1024 * 1024; // 5MB in bytes