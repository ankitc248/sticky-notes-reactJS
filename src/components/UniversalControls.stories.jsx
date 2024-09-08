import { UniversalControls } from "./UniversalControls";
import { useState } from "react";

export default {
  title: "StickyNotes/UniversalControls",
  component: UniversalControls,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

const Template = (args) => {
  const [config, setConfig] = useState({
    handWrittenNote: false,
    foldedDisplay: false,
    listDisplay: false,
  });
  const setPopupValues = () => {};
  const setNotePopup = () => {};
  return (
    <UniversalControls
      {...args}
      config={config}
      setConfig={setConfig}
      setPopupValues={setPopupValues}
      setNotePopup={setNotePopup}
    />
  );
};

export const Default = Template.bind({});

Default.args = {};
