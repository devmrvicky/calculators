export const copyResult = (elem) => {
  // Create a range and select the text within the source div
  const range = document.createRange();
  range.selectNode(elem);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  // Copy the selected text to the clipboard
  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Failed to copy text:", err);
  }

  // Clear the selection
  window.getSelection().removeAllRanges();
};
