const SSHTunnel = require("../utils/sshTunnel.js");
const sendActionToDBAndHandleResponse = require("../utils/dbActionHandler.js");
const sshTunnel = new SSHTunnel();

function handler(data, stream) {
  const inputMessage = data.toString();

  if (inputMessage === "00012sinitOKprofe") {
    console.log({ inputMessage });
    console.log("Servicio Inicio de Sesion enlazado al bus");
    return;
  }

  const IdService = inputMessage.slice(5, 10);
  if (IdService === "profe") {
    console.log({ inputMessage });
    const [entity, action, ...params] = inputMessage.slice(11).split("|");
    let sucessMsg, errorMsg;
    switch (action) {
      case "create": {
        //00046profe|profesor|create|felipe@correo.com|felipe
        sucessMsg = IdService + "exito";
        errorMsg = IdService + "fracaso";
        break;
      }
      case "delete": {
        //00046profe|profesor|delete|felipe@correo.com
        sucessMsg = IdService + "eliminado";
        errorMsg = IdService + "noeliminado";
        break;
      }
      case "enroll": {
        //00046profe|profesor|enroll|${codigo_curso}|${id_profesor}
        sucessMsg = IdService + "ingresado";
        errorMsg = IdService + "noingresado";
        entity = "profesorCurso";
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
