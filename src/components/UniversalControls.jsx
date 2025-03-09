import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useRef } from "react";

export const UniversalControls = ({
  config,
  setConfig,
  setPopupValues,
  setNotePopup,
  handleExportNotes,
  handleImportNotes,
}) => {
  return (
    <div className="add-note-container">
      <div className="universal-controls">
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
        >
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
        >
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
        >
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
          <img
            src="assets/note-icons/import.svg"
            alt="stretch"
            className="icon svg"
          />
          Export
        </motion.button>
        <ImportNotesButton handleImportNotes={handleImportNotes} />
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


const ImportNotesButton = ({ handleImportNotes }) => {
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
      <img
        src="assets/note-icons/export.svg"
        alt="stretch"
        className="icon svg"
      />
      Import
    </motion.button> <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={() => handleImportNotes(fileInputRef)}
        accept=".json"
      />
    </>
  );
};