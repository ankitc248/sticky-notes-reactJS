
import { motion } from "framer-motion";
import PropTypes from "prop-types";export const NoteEditorFooter = ({
  onSaveClick,
  onCloseClick,
  noteText,
  noteTitle,
  values,
  noteProperties,
}) => {
  return (
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
  );
};
NoteEditorFooter.propTypes = {
  onSaveClick: PropTypes.func,
  onCloseClick: PropTypes.func,
  noteText: PropTypes.array,
  noteTitle: PropTypes.string,
  values: PropTypes.object,
  noteProperties: PropTypes.object,
};
