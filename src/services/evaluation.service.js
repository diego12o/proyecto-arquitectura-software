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
    if (
      action == "addEvaluation" ||
      action == "seeAvg" ||
      action == "seeEvaluation" ||
      action == "SeeComments" ||
      action == "updateComment" ||
      action == "editEvaluation" ||
      action == "deleteEvaluation" ||
      action == "deleteEvaluationAdmin"
    ) {
      return sendActionToDBAndHandleResponse(
        stream,
        "evaluation",
        action,
        params,
        idService + "exito",
        idService + "fracaso"
      );
    }
  }
}

sshTunnel.connect(handler, "00010sinitevalu");
