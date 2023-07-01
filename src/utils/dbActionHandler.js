const { formatMessageWithLengthPrefix } = require("./messageFormatter");

function sendActionToDBAndHandleResponse(
  stream,
  entity,
  action,
  params,
  successMsg,
  errorMsg
) {
  const MessageToSVDB = formatMessageWithLengthPrefix(
    `DBser|${entity}|${action}|${params.join("|")}`
  );
  console.log({ MessageToSVDB });
  stream.write(MessageToSVDB);

  stream.once("data", (data) => {
    const responseMessageSVDB = data.toString();

    const idServiceBDResponse = responseMessageSVDB.slice(5, 10);

    if (idServiceBDResponse === "DBser") {
      console.log({ responseMessageSVDB });
      const payload = responseMessageSVDB.slice(10);

      const message = payload.includes("exito") ? successMsg : errorMsg;
      const messageToBus = formatMessageWithLengthPrefix(
        message + "|" + payload
      );
      console.log({ messageToBus });
      stream.write(messageToBus);
    }
  });
}

module.exports = { sendActionToDBAndHandleResponse };
