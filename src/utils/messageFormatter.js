function formatMessageWithLengthPrefix(message) {
  const length = message.length;
  const lengthString = length.toString().padStart(5, "0");
  return lengthString + message;
}

module.exports = {
  formatMessageWithLengthPrefix,
};
