const SSHTunnel = require("../../shared/sshTunnel.js");
const executeUserAction = require("./entityActions/user.action.js");

const sshTunnel = new SSHTunnel();

function handler(data, error, stream) {
  const message = data.toString();
  console.log({ message });

  if (message === "00012sinitOKDBser") {
    console.log("Servicio enlazado al bus");
    return;
  }

  const idService = stringData.slice(5, 10);
  const payload = stringData.slice(10);
  const [entity, action, ...params] = payload.split("|");

  if (idService === "DBser") {
    switch (entity) {
      case "usuar":
        executeUserAction(action, params, stream);
    }
  }
}

sshTunnel.connect(handler, "00010sinitDBser");
