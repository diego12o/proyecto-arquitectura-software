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
      const isExitoInStr = payload.includes("exito");
      const isActualizadoInStr = payload.includes("actualizado");
      const isEliminadoInStr = payload.includes("eliminado");
      const isExisteInStr = payload.includes("existe");

      const isSuccess =
        isExitoInStr || isActualizadoInStr || isEliminadoInStr || isExisteInStr;

      const message = isSuccess ? successMsg : errorMsg;
      const messageToBus = formatMessageWithLengthPrefix(
        message + "|" + payload
      );
      console.log({ messageToBus });
      stream.write(messageToBus);
    }
  });
}

module.exports = sendActionToDBAndHandleResponse;
