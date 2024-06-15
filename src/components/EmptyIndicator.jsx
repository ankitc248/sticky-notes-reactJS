import { motion } from "framer-motion";
export const EmptyIndicator = ({ setPopupValues, setNotePopup }) => {
  return (
    <div className="empty-notes">
      No notes added yet
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
        </motion.button>
      </p>
    </div>
  );
};
