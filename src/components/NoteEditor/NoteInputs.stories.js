import { NoteInputs } from "./NoteInputs";
export default {
  title: "NoteEditor/NoteInputs",
  component: NoteInputs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    characterLeft: { control: "number" },
  },
};

const Template = (args) => {
  const setNoteTitle = () => {};
  const handleKeyInput = () => {};
  const handleTextInput = () => {};
  return (
    <NoteInputs
      {...args}
      setNoteTitle={setNoteTitle}
      handleKeyInput={handleKeyInput}
      handleTextInput={handleTextInput}
    />
  );
};

export const Default = Template.bind({});

Default.args = {
  characterLeft: 20,
  noteProperties: {
    title: "Note title",
    text: ["Text 1", "Text 2", "Text 3"],
  },
};
