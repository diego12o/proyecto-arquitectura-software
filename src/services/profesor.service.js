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
    const [action, ...params] = inputMessage.slice(11).split("|");
    let entity = "profesor";
    if (action == "create" || action == "delete" || action == "update") {
      return sendActionToDBAndHandleResponse(
        stream,
        entity,
        action,
        params,
        IdService + "exito",
        IdService + "fracaso"
      );
    } else if (action == "enroll") {
      return sendActionToDBAndHandleResponse(
        stream,
        "profesorCurso",
        action,
        params,
        IdService + "exito",
        IdService + "fracaso"
      );
    }
  }
}

sshTunnel.connect(handler, "00010sinitprofe");
