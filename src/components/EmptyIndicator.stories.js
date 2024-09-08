import { useState } from "react";
import { EmptyIndicator } from "./EmptyIndicator";

export default {
  title: "StickyNotes/EmptyIndicator",
  component: EmptyIndicator,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

const Template = (args) => {
  const [popupValues, setPopupValues] = useState(null);
  const [notePopup, setNotePopup] = useState(false);

  return (
    <EmptyIndicator
      {...args}
      setPopupValues={setPopupValues}
      setNotePopup={setNotePopup}
    />
  );
};

export const Default = Template.bind({});

Default.args = {};
