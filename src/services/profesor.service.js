const SSHTunnel = require("../utils/sshTunnel.js");
const sendActionToDBAndHandleResponse = require("../utils/dbActionHandler.js");
const sshTunnel = new SSHTunnel();

function handler(data, stream) {
  const inputMessage = data.toString();
  console.log({ inputMessage });

  if (inputMessage === "00012sinitOKprofe") {
    console.log("Servicio Inicio de Sesion enlazado al bus");
    return;
  }

  //00046profe|profesor|create|felipe@correo.com|felipe
  const IdService = inputMessage.slice(5, 10);
  if (IdService === "profe") {
    console.log({ inputMessage });
    const [entity, action, ...params] = inputMessage.slice(11).split("|");
    let sucessMsg, errorMsg;
    switch (action) {
      case "create": {
        sucessMsg = IdService + "exito";
        errorMsg = IdService + "fracaso";
        break;
      }
      case "delete": {
        sucessMsg = IdService + "eliminado";
        errorMsg = IdService + "noeliminado";
        break;
      }
    }

    return sendActionToDBAndHandleResponse(
      stream,
      entity,
      action,
      params,
      sucessMsg,
      errorMsg
    );
  }
}

sshTunnel.connect(handler, "00010sinitprofe");
