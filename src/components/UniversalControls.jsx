import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useRef, useState } from "react";

export const UniversalControls = ({
  config,
  setConfig,
  setPopupValues,
  setNotePopup,
  handleExportNotes,
  handleImportNotes,
  notes,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  return (
    <div className="add-note-container">
   <div className={`options-container ${showOptions?"active":""}`}><div className="inner-container"><motion.button
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
        <ImportNotesButton handleImportNotes={handleImportNotes} notes={notes} />
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


const ImportNotesButton = ({ handleImportNotes, notes }) => {
  const fileInputRef = useRef(null);

  return (
    <>        
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        fileInputRef.current.click();
      }}
    >
      Import notes
      <img
        src="assets/note-icons/file-arrow-up.svg"
        alt="import"
        className="icon svg"
      />
    </motion.button> <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={() => handleFileImport(fileInputRef, notes)}
        accept=".json"
      />
    </>
  );
};


const handleFileImport = (fileInputRef, notes) => {
  return new Promise((resolve, reject) => {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      console.log('No file selected');
      reject(new Error('No file selected'));
      return;
    }

    // Check if file is JSON
    if (!file.name.toLowerCase().endsWith('.json')) {
      console.log('Invalid file type. Please select a JSON file');
      fileInputRef.current.value = '';
      reject(new Error('Invalid file type. Please select a JSON file'));
      return;
    }

    console.log('File selected:', file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        console.log('File content:', e.target.result);
        const importedNotes = JSON.parse(e.target.result);
        console.log('Parsed notes:', importedNotes);
        
        // Create a map of existing notes by ID for easier lookup
        const existingNotesMap = new Map(notes.map(note => [note.id, note]));
        const newNotes = [];
        const duplicateNotes = [];
        const updatedNotes = [];
        
        importedNotes.forEach(importedNote => {
          const existingNote = existingNotesMap.get(importedNote.id);
          
          if (!existingNote) {
            console.log(`Note ${importedNote.id} is new, adding...`);
            newNotes.push(importedNote);
          } else {
            // Keep the note with the later lastModifiedTime
            const importedTime = new Date(importedNote.lastModifiedTime).getTime();
            const existingTime = new Date(existingNote.lastModifiedTime).getTime();
            console.log({importedTime, existingTime})
            if (importedTime > existingTime) {
              console.log(`Note ${importedNote.id} is newer, updating...`);
              updatedNotes.push(importedNote);
            } else {
              console.log(`Note ${importedNote.id} is older or same age, keeping existing version`);
            }
          }
        });
        
        fileInputRef.current.value = '';
        // Combine new notes with updated notes
        const finalNotes = [...newNotes, ...updatedNotes];
        console.log("finalNotes", finalNotes);
        resolve(finalNotes);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        fileInputRef.current.value = '';
        reject(new Error('Invalid JSON file'));
      }
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      fileInputRef.current.value = '';
      reject(new Error('Error reading file'));
    };
    reader.readAsText(file);
  });
};