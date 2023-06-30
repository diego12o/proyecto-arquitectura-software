const SSHTunnel = require("../utils/sshTunnel.js");
const sendActionToDBAndHandleResponse = require("../utils/dbActionHandler");

const sshTunnel = new SSHTunnel();

function handler(data, stream) {
  const inputMessage = data.toString();

  if (inputMessage === "00012sinitOKevalu") {
    console.log("Servicio Evaluación enlazado al bus");
    return;
  }

  const idService = inputMessage.slice(5, 10);
  const payload = inputMessage.slice(11);
  const [action, ...params] = payload.split("|");

  if (idService === "evalu") {
    console.log({ inputMessage });
    switch (action) {
      case "addEvaluation":
        return sendActionToDBAndHandleResponse(
          stream,
          "evaluation",
          action,
          params,
          idService + "exito",
          idService + "fracaso"
        );
      case "seeAvg":
        return sendActionToDBAndHandleResponse(
          stream,
          "evaluation",
          action,
          params,
          idService + "exito",
          idService + "fracaso"
        );
      case "seeEvaluation":
        return sendActionToDBAndHandleResponse(
          stream,
          "evaluation",
          action,
          params,
          idService + "exito",
          idService + "fracaso"
        );
      case "seeComments":
        return sendActionToDBAndHandleResponse(
          stream,
          "evaluation",
          action,
          params,
          idService + "exito",
          idService + "fracaso"
        );
      case "updateComment":
        return sendActionToDBAndHandleResponse(
          stream,
          "evaluation",
          action,
          params,
          idService + "actualizado",
          idService + "noactualizado"
        );
      case "editEvaluation":
        return sendActionToDBAndHandleResponse(
          stream,
          "evaluation",
          action,
          params,
          idService + "actualizado",
          idService + "noactualizado"
        );
      case "deleteEvaluation":
        return sendActionToDBAndHandleResponse(
          stream,
          "evaluation",
          action,
          params,
          idService + "eliminado",
          idService + "noeliminado"
        );
      case "deleteEvaluationAdmin":
        return sendActionToDBAndHandleResponse(
          stream,
          "evaluation",
          action,
          params,
          idService + "eliminado",
          idService + "noeliminado"
        );
    }
  }
}

sshTunnel.connect(handler, "00010sinitevalu");