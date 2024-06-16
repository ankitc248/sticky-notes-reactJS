import { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
export const Note = ({ values, onEditClick, onUpdate }) => {
  const [noteColor, setNoteColor] = useState(values.color);
  const [folded, setFolded] = useState(values.folded);
  const [textStatus, setTextStatus] = useState(values.textStatus);
  const [noteType, setNoteType] = useState(values.type);
  const noteColors = ["yellow", "green", "blue", "pink"];
  const handleTextStatusUpdate = (index) => {
    let tempTextStatus = textStatus;
    tempTextStatus[index] = !tempTextStatus[index];
    setTextStatus(tempTextStatus);
    onUpdate(values);
  };

  useEffect(() => {
    values.color = noteColor;
    values.folded = folded;
    values.textStatus = textStatus;
    values.type = noteType;
  }, [values, noteColor, folded, textStatus, noteType]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: values.id,
  });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : "",
    transition,
    zIndex: isDragging ? "100" : "auto",
    opacity: isDragging ? 0.75 : 1,
  };
  return (
    <div
      style={style}
      className={`note ${noteColor} ${folded ? "folded" : ""} ${isDragging ? "dragged" : ""}`}
      ref={setNodeRef}
    >
      <div className="note-footer for-horizontal">
        <div className="note-colors">
          {noteColors.map((color) => (
            <button
              key={color}
              type="button"
              className={`note-color ${color}`}
              onClick={() => {
                setNoteColor(color);
                onUpdate(values);
              }}
            ></button>
          ))}
        </div>
      </div>
      <div className="note-body">
        <button
          className="note-fold"
          onClick={() => {
            setFolded(!folded);
            onUpdate(values);
          }}
        ></button>
        <p className="note-title">{values.title}</p>
        <ul className="note-tasks">
          {values.text.map((text, index) => (
            <li
              className={`note-task ${textStatus[index] ? "done" : ""}`}
              key={index}
              onClick={() => {
                handleTextStatusUpdate(index);
              }}
            >
              {text}
            </li>
          ))}
        </ul>
      </div>
      <div className="note-footer">
        <div className="drag-handle" {...listeners} {...attributes}>
          <img
            src="/assets/note-icons/drag-indicator.svg"
            alt="drag-handle"
            className="icon svg"
            style={{ maxWidth: "18px" }}
          />
        </div>
        <div className="note-colors">
          {noteColors.map((color) => (
            <button
              key={color}
              type="button"
              className={`note-color ${color}`}
              onClick={() => {
                setNoteColor(color);
                onUpdate(values);
              }}
            ></button>
          ))}
        </div>
        <div className="note-controls">
          <button
            type="button"
            className="note-control note-control-edit"
            onClick={() => {
              onEditClick();
            }}
          >
            <span className="button-icon">
              <img
                src="assets/note-icons/edit-2.svg"
                className="icon svg"
                alt="edit"
                style={{ maxWidth: "18px" }}
              />
            </span>
            <span className="button-tooltip">Edit</span>
          </button>
          <button
            type="button"
            className="note-control note-control-undo"
            onClick={() => {
              setNoteType("pending");
              onUpdate(values);
            }}
          >
            <span className="button-icon">
              <img
                src="assets/note-icons/undo.svg"
                className="icon svg"
                alt="undo"
              />
            </span>
            <span className="button-tooltip">Mark pending</span>
          </button>
          <button
            type="button"
            className="note-control note-control-delete"
            onClick={() => {
              setNoteType("deleted");
              onUpdate(values);
            }}
          >
            <span className="button-icon">
              <img
                src="assets/note-icons/delete-1.svg"
                className="icon svg"
                alt="delete"
              />
            </span>
            <span className="button-tooltip">Delete</span>
          </button>
          <button
            type="button"
            className="note-control note-control-archive"
            onClick={() => {
              setNoteType("archived");
              onUpdate(values);
            }}
          >
            <span className="button-icon">
              <img
                src="assets/note-icons/archive.svg"
                className="icon svg"
                alt="archive"
              />
            </span>
            <span className="button-tooltip">Archive</span>
          </button>
          <button
            type="button"
            className="note-control note-control-complete"
            onClick={() => {
              setNoteType("completed");
              onUpdate(values);
            }}
          >
            <span className="button-icon">
              <img
                src="assets/note-icons/check.svg"
                className="icon svg"
                alt="complete"
              />
            </span>
            <span className="button-tooltip">Mark complete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const NoteControlButton = ({ type, onClick, iconName, tooltip }) => {
  return (
    <button
      type="button"
      className={`note-control note-control-${type}`}
      onClick={onClick}
    >
      <span className="button-icon">
        <img
          src={`assets/note-icons/${type}.svg`}
          className="icon svg"
          alt={type}
        />
      </span>
      <span className="button-tooltip">{type}</span>
    </button>
  );
};
