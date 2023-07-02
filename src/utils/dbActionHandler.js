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
      let payload;
      let message;
      if (responseMessageSVDB.includes("exito")) {
        payload = responseMessageSVDB.slice(18);
        console.log({ payload });
        message = !payload ? successMsg : `${successMsg}|${payload}`;
      } else if (responseMessageSVDB.includes("fracaso")) {
        payload = responseMessageSVDB.slice(20);
        message = !payload ? errorMsg : `${successMsg}|${payload}`;
      }
      const messageToBus = formatMessageWithLengthPrefix(message);

      console.log({ messageToBus });
      stream.write(messageToBus);
    }
  });
}

module.exports = { sendActionToDBAndHandleResponse };
