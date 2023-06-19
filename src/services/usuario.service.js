const SSHTunnel = require("../shared/sshTunnel.js");
const sendActionToDBAndHandleResponse = require("../utils/dbActionHandler");

const sshTunnel = new SSHTunnel();

function handler(data, error, stream) {
  const stringData = data.toString();

  if (stringData === "00012sinitOKusuar") {
    console.log("Servicio Usuario enlazado al bus");
    return;
  }

  const idService = stringData.slice(5, 10);
  const payload = stringData.slice(10);
  const [action, ...params] = payload.split("|");

  if (idService === "usuar") {
    switch (action) {
      case "create":
        sendActionToDBAndHandleResponse(
          stream,
          action,
          params,
          "usuarexito",
          "usuarfracaso"
        );
        break;

      case "update":
        sendActionToDBAndHandleResponse(
          stream,
          action,
          params,
          "usuaractualizado",
          "usuarnoactualizado"
        );
        break;

      case "delete":
        sendActionToDBAndHandleResponse(
          stream,
          action,
          params,
          "usuareliminado",
          "usuarnoeliminado"
        );
        break;
    }
  }
}

sshTunnel.connect(handler, "00010sinitisess");
