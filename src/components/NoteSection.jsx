import { motion } from "framer-motion";
import { NoteContainer } from "./NoteContainer";
export const NoteSection = ({
  notes,
  type,
  setPopupValues,
  setNotePopup,
  handleNoteSave,
}) => {
  return (
    <div className={`notes-section ${type}`}>
      <div className="notes-header">
        <motion.div
          className="notes-header-title"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>{type} tasks</h1>
        </motion.div>
      </div>
      <NoteContainer
        notes={notes}
        setPopupValues={setPopupValues}
        setNotePopup={setNotePopup}
        handleNoteSave={handleNoteSave}
      />
    </div>
  );
};
