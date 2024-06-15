import { motion } from "framer-motion";
export const UniversalControls = ({
  config,
  setConfig,
  setPopupValues,
  setNotePopup,
}) => {
  return (
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
  );
};
