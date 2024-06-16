import { motion } from "framer-motion";
import { NoteContainer } from "./NoteContainer";
import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
export const NoteSection = ({
  notes,
  type,
  setPopupValues,
  setNotePopup,
  handleNoteSave,
  onNoteReorder,
}) => {
  const handleDragEnd = (event) => {
    setIsDragging(false);
    setActiveId(null);
    const { active, over } = event;
    if (active.id !== over.id) {
      onNoteReorder([active.id, over.id]);
    }
  };
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setIsDragging(true);
  };

  const [activeId, setActiveId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  return (
    <div className={`notes-section ${type} ${isDragging ? "dragging" : ""}`}>
      <div className="notes-header">
        <motion.div
          className="notes-header-title"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>{type} tasks</h1>
        </motion.div>
      </div>
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        modifiers={[restrictToWindowEdges]}
      >
        <SortableContext items={notes} strategy={rectSortingStrategy}>
          <NoteContainer
            activeId={activeId}
            type={type}
            notes={notes}
            setPopupValues={setPopupValues}
            setNotePopup={setNotePopup}
            handleNoteSave={handleNoteSave}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
};
