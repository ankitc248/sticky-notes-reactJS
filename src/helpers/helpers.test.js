import { handleKeyInput } from "./helpers";

describe("handleKeyInput function", () => {
  test("should prevent input if characterLeft is 0 and key is not Backspace", () => {
    const mockEvent = { key: "a", preventDefault: jest.fn() };

    // Call the function with characterLeft = 0
    handleKeyInput(mockEvent, 0, [], 10);

    // Assert that preventDefault was called
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  test("should allow Backspace even when characterLeft is 0", () => {
    const mockEvent = { key: "Backspace", preventDefault: jest.fn() };

    // Call the function with characterLeft = 0
    handleKeyInput(mockEvent, 0, [], 10);

    // Assert that preventDefault was NOT called for Backspace
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
  });

  test("should prevent Enter key input if maxLines are reached", () => {
    const mockEvent = { key: "Enter", preventDefault: jest.fn() };
    const noteText = new Array(10).fill("Line"); // Simulate noteText having maxLines

    // Call the function with maxLines reached
    handleKeyInput(mockEvent, 10, noteText, 10);

    // Assert that preventDefault was called
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  test("should allow Enter key input if maxLines are not reached", () => {
    const mockEvent = { key: "Enter", preventDefault: jest.fn() };
    const noteText = new Array(9).fill("Line"); // Simulate noteText below maxLines

    // Call the function with fewer than maxLines
    handleKeyInput(mockEvent, 10, noteText, 10);

    // Assert that preventDefault was NOT called
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
  });
});
