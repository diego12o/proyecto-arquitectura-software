const SSHTunnel = require("../utils/sshTunnel.js");
const sendActionToDBAndHandleResponse = require("../utils/dbActionHandler.js");
const sshTunnel = new SSHTunnel();

function handler(data, stream) {
  const inputMessage = data.toString();

  if (inputMessage === "00012sinitOKisess") {
    console.log("Servicio Inicio de Sesion enlazado al bus");
    return;
  }

  const IdService = inputMessage.slice(5, 10);
  if (IdService === "isess") {
    console.log({ inputMessage });
    const [mail, pass] = inputMessage.slice(11).split("|");
    sendActionToDBAndHandleResponse(
      stream,
      "user",
      "isess",
      [mail, pass],
      IdService + "exito",
      IdService + "fracaso"
    );
  }
}

sshTunnel.connect(handler, "00010sinitisess");
