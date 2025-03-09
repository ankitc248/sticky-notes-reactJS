import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useRef, useState } from "react";

export const UniversalControls = ({
  config,
  setConfig,
  setPopupValues,
  setNotePopup,
  handleExportNotes,
  notes,
  setNotes,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div className="add-note-container">
      <div className={`options-container ${showOptions ? "active" : ""}`}>
        <div className="inner-container">
          <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`handwritten-toggle ${config.handwrittenNote ? "active" : ""
          }`}
        onClick={() => {
          setConfig({
            ...config,
            handwrittenNote: !config.handwrittenNote,
          });
        }}
      >{config.handwrittenNote ? "Handwritten" : "Accessible"}
        <span className="button-icon">
          <img
            src="assets/note-icons/icon-of-a-hand-holding-a-pencil.svg"
            alt="handwritten"
            className="icon svg"
          />
        </span>
      </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`folded-toggle ${config.foldedDisplay ? "active" : ""}`}
          onClick={() => {
            setConfig({ ...config, foldedDisplay: !config.foldedDisplay });
          }}
        >{config.foldedDisplay ? "Folded notes only" : "All notes"}
          <img
            src="assets/note-icons/page-with-corner-folded.svg"
            alt="folded"
            className="icon svg"
          />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`list-toggle ${config.listDisplay ? "active" : ""}`}
          onClick={() => {
            setConfig({ ...config, listDisplay: !config.listDisplay });
          }}
        >{config.listDisplay ? "List view" : "Grid view"}
          <img
            src="assets/note-icons/burger-simple.svg"
            alt="stretch"
            className="icon svg"
          />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExportNotes}
        >
          Export notes
          <img
            src="assets/note-icons/file-arrow-down.svg"
            alt="stretch"
            className="icon svg"
          />
        </motion.button>
        <ImportNotesButton setNotes={setNotes} notes={notes} />
        {/* <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExportNotes}
        >
          <img
            src="assets/note-icons/computer-programmer.svg"
            alt="stretch"
            className="icon svg"
          />
          
        </motion.button> */}
      </div>
      </div>

      <div className="universal-controls">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowOptions(!showOptions)}
          className={`options-toggle ${showOptions ? "active" : ""}`}
        >
          <img
            src="assets/note-icons/options.svg"
            alt="options"
            className="icon svg"
          />
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
          {/* <span className="button-icon">&#x2b;</span> */}
          <span className="button-text"> + Stick a note</span>
        </motion.button>
      </div>
    </div>
  );
};

UniversalControls.propTypes = {
  config: PropTypes.object,
  setConfig: PropTypes.func,
  setPopupValues: PropTypes.func,
  setNotePopup: PropTypes.func,
};


const ImportNotesButton = ({ setNotes, notes }) => {
  const fileInputRef = useRef(null);

  const handleImportNotes = async () => {
    const finalNotes = await handleFileImport(fileInputRef, notes);
    setNotes(finalNotes);
    window.location.reload();
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          fileInputRef.current.click();
        }}
      >
        Import notes (WIP)
        <img
          src="assets/note-icons/file-arrow-up.svg"
          alt="import"
          className="icon svg"
        />
      </motion.button> <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImportNotes}
        accept=".json"
      />
    </>
  );
};


const handleFileImport = (fileInputRef, notes) => {
  return new Promise((resolve, reject) => {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      alert('No file selected');
      reject(new Error('No file selected'));
      return;
    }

    // Check if file is JSON
    if (!file.name.toLowerCase().endsWith('.json')) {
      alert('Invalid file type. Please select a JSON file');
      fileInputRef.current.value = '';
      reject(new Error('Invalid file type. Please select a JSON file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedNotes = JSON.parse(e.target.result);

        // Create a map of existing notes by ID for easier lookup
        const existingNotesMap = new Map(notes.map(note => [note.id, note]));
        const newNotes = [];
        const updatedNotes = [];

        importedNotes.forEach(importedNote => {
          const existingNote = existingNotesMap.get(importedNote.id);

          if (!existingNote) {
            console.log(`Note ${importedNote.id} is new, adding...`);
            newNotes.push(importedNote);
          } else {
            // Keep the note with the later lastModifiedDateTime
            const importedTime = new Date(importedNote.lastModifiedDateTime).getTime();
            const existingTime = new Date(existingNote.lastModifiedDateTime).getTime();
            if (importedTime > existingTime) {
              console.log(`Note ${importedNote.id} is newer, updating...`);
              updatedNotes.push(importedNote);
            }
          }
        });

        fileInputRef.current.value = '';

        const finalNotes = [
          ...notes.map(note => {
            const updatedNote = updatedNotes.find(n => n.id === note.id);
            return updatedNote || note;
          }),
          ...newNotes
        ];
        
        alert(`Import successful!\n${newNotes.length} new notes added\n${updatedNotes.length} notes updated.\n\n App will refresh to show the new notes.`);
        resolve(finalNotes);
      } catch (error) {
        alert('Error: Invalid JSON file format');
        console.error('Error parsing JSON:', error);
        fileInputRef.current.value = '';
        reject(new Error('Invalid JSON file'));
      }
    };

    reader.onerror = (error) => {
      alert('Error reading file. Please try again.');
      console.error('Error reading file:', error);
      fileInputRef.current.value = '';
      reject(new Error('Error reading file'));
    };
    reader.readAsText(file);
  });
};