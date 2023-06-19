const SSHTunnel = require("../shared/sshTunnel.js");
const sendActionToDBAndHandleResponse = require("../utils/dbActionHandler.js");
const sshTunnel = new SSHTunnel();

function handler(data, error, stream) {
  const StringData = data.toString();
  console.log({ StringData });

  if (StringData === "00012sinitOKisess") {
    console.log("Servicio Inicio de Sesion enlazado al bus");
  }

  const IdService = StringData.slice(5, 10);
  if (IdService === "isess") {
    const [mail, pass] = StringData.slice(10).split("|");

    sendActionToDBAndHandleResponse(
      stream,
      "isess",
      [mail, pass],
      "isisessexiste",
      "isessnoexiste"
    );
  }
}

sshTunnel.connect(handler, "00010sinitisess");
