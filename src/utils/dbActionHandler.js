const { formatMessageWithLengthPrefix } = require("./messageFormatter");

function sendActionToDBAndHandleResponse(
  stream,
  action,
  params,
  successMsg,
  errorMsg
) {
  const message = formatMessageWithLengthPrefix(
    `DBser${action}|${params.join("|")}`
  );
  console.log({ message });
  stream.write(message);

  stream.on("data", (data) => {
    const stringData = data.toString();
    const idServiceBDResponse = stringData.slice(5, 10);

    if (idServiceBDResponse === "DBser") {
      const payload = stringData.slice(10);
      const isSuccess = ["exito", "actualizado", "eliminado"].includes(payload);
      stream.write(
        formatMessageWithLengthPrefix(isSuccess ? successMsg : errorMsg)
      );
    }
  });
}

module.exports = sendActionToDBAndHandleResponse;
