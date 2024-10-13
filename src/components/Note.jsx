import { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import PropTypes from "prop-types";
export const Note = ({ values, onEditClick, onUpdate }) => {
  const [noteColor, setNoteColor] = useState(values.color);
  const [folded, setFolded] = useState(values.folded);
  const [textStatus, setTextStatus] = useState(values.textStatus);
  const [noteType, setNoteType] = useState(values.type);
  const noteColors = ["yellow", "green", "blue", "pink"];

  const handleTextStatusUpdate = (index) => {
    let tempTextStatus = values.textStatus;
    tempTextStatus[index] = !tempTextStatus[index];
    setTextStatus(tempTextStatus);
    values.textStatus = tempTextStatus;
    onUpdate(values);
  };

  useEffect(() => {
    values.color = noteColor;
    values.type = noteType;
    values.folded = folded;
  }, [noteColor, folded, noteType, values]);

  useEffect(() => {
    values.textStatus = textStatus;
  }, [textStatus]);

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
      className={`note ${noteColor} ${folded ? "folded" : ""} ${
        isDragging ? "dragged" : ""
      }`}
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
          {values.text.map((text, index) => {
            if (index < 5) {
              return (
                <li key={index + text}>
                  <button
                    type="button"
                    className={`note-task ${values.textStatus.length && values.textStatus[index] ? "done" : ""}`}
                    onClick={() => {
                      handleTextStatusUpdate(index);
                    }}
                  >
                    {text}
                  </button>
                </li>
              );
            }
            return null;
          })}
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
          <NoteControlButton
            type="edit"
            iconName="edit-2"
            tooltip="Edit"
            onClick={() => {
              onEditClick();
            }}
          />
          <NoteControlButton
            type="undo"
            iconName="undo"
            tooltip="Mark Pending"
            onClick={() => {
              setNoteType("pending");
              onUpdate(values);
            }}
          />
          <NoteControlButton
            type="delete"
            iconName="delete-1"
            tooltip="Delete"
            onClick={() => {
              setNoteType("deleted");
              onUpdate(values);
            }}
          />
          <NoteControlButton
            type="archive"
            iconName="archive"
            tooltip="Archive"
            onClick={() => {
              setNoteType("archived");
              onUpdate(values);
            }}
          />
          <NoteControlButton
            type="complete"
            iconName="check"
            tooltip="Mark complete"
            onClick={() => {
              setNoteType("completed");
              onUpdate(values);
            }}
          />
        </div>
      </div>
    </div>
  );
};
Note.propTypes = {
  values: PropTypes.object,
  onUpdate: PropTypes.func,
  onEditClick: PropTypes.func,
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
          src={`assets/note-icons/${iconName}.svg`}
          className="icon svg"
          alt={type}
        />
      </span>
      <span className="button-tooltip">{tooltip}</span>
    </button>
  );
};

//IN DEVELOPMENT
const prettyStrikethrough = (element) => {
  const strikeDelay = 0.25;
  let container = element;
  function countLines(element) {
    let divHeight = element.offsetHeight;
    let divWidth = element.offsetWidth;
    const styles = window.getComputedStyle(element);
    let lineHeight = parseInt(styles.lineHeight);
    let padding = parseInt(styles.padding);
    let fontSize = parseInt(styles.fontSize);
    let lines = Math.floor((divHeight - padding * 2) / lineHeight);
    let linesText = calcLines(element, lines);
    let linesInfo = {
      lines: lines,
      fontSize: fontSize,
      lineHeight: lineHeight,
      padding: padding,
      width: divWidth,
      linesText: linesText,
    };
    return linesInfo;
  }

  let linesInfo = countLines(container);
  if (container.classList.contains("done")) {
    if (container.querySelector(".old-text"))
      container.innerText = container.querySelector(".old-text").innerText;
    return;
  }
  let oldTextElement = document.createElement("span");
  oldTextElement.classList.add("old-text");
  oldTextElement.innerText = container.innerText;
  container.innerText = "";
  container.appendChild(oldTextElement);
  for (let i = 0; i < linesInfo.lines; i++) {
    let strikeElement = "";
    let eachLineElement = "";
    let delay = i * strikeDelay;
    eachLineElement = document.createElement("span");
    eachLineElement.classList.add("each-line");
    strikeElement = document.createElement("span");
    strikeElement.classList.add("striking-line");
    strikeElement.style.animationDelay = delay + "s";
    strikeElement.style.backgroundColor = "#111";
    eachLineElement.innerText = linesInfo.linesText[i];
    eachLineElement.appendChild(strikeElement);
    container.appendChild(eachLineElement);
  }

  function calcLines(element, noOfLines) {
    let allText = element.innerText.trim();
    let chars = getCharsPerLine(element);
    let calc = noOfLines * chars - allText.length;
    for (let i = 0; i < calc; i++) allText += " ";

    const words = allText.split(/\s+/);

    let lines = [];
    let currentLine = [];
    let currentLength = 0;
    const targetLength = Math.ceil(allText.length / noOfLines);

    for (let word of words) {
      if (
        currentLength + word.length + (currentLine.length > 0 ? 1 : 0) >
          targetLength &&
        lines.length < noOfLines - 1
      ) {
        lines.push(currentLine.join(" "));
        currentLine = [];
        currentLength = 0;
      }

      currentLine.push(word);
      currentLength += word.length + (currentLine.length > 1 ? 1 : 0);
    }

    if (currentLine.length > 0) {
      lines.push(currentLine.join(" "));
    }

    while (lines.length < noOfLines) {
      lines.push("");
    }
    return lines;
  }

  function getCharsPerLine(element) {
    const styles = window.getComputedStyle(element);
    let padding = parseInt(styles.padding);
    let target_width = element.offsetWidth - padding * 2;
    let text = element.innerText;
    let span = document.createElement("span");
    document.body.appendChild(span);
    span.style.whiteSpace = "nowrap";
    span.style.fontFamily = styles.fontFamily;
    span.style.fontSize = styles.fontSize;
    let fit = text.length;
    for (let i = 0; i < fit; ++i) {
      span.innerHTML += text[i];
      if (span.clientWidth > target_width) {
        fit = i - 1;
        break;
      }
    }
    span.remove();
    return fit;
  }
};
