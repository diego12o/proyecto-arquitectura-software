const SSHTunnel = require("../utils/sshTunnel.js");
const { sendActionToDBAndHandleResponse } = require("../utils/dbActionHandler");

const sshTunnel = new SSHTunnel();

function handler(data, stream) {
  const inputMessage = data.toString();

  if (inputMessage === "00012sinitOKusuar") {
    console.log("Servicio Usuario enlazado al bus");
    return;
  }

  const idService = inputMessage.slice(5, 10);
  const payload = inputMessage.slice(11);
  const [action, ...params] = payload.split("|");

  if (idService === "usuar") {
    console.log({ inputMessage });
    if (action === "create" || action === "update" || action === "delete") {
      return sendActionToDBAndHandleResponse(
        stream,
        "user",
        action,
        params,
        idService + "exito",
        idService + "fracaso"
      );
    }
  }
}

sshTunnel.connect(handler, "00010sinitusuar");
