export const handleKeyInput = (e, characterLeft, noteText, maxLines) => {
  if (!characterLeft) {
    if (e.key !== "Backspace") e.preventDefault();
  }
  if (e.key === "Enter") {
    if (noteText.length === maxLines) {
      e.preventDefault();
    }
  }
};
