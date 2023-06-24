const SSHTunnel = require("../../utils/sshTunnel.js");
const { executeUserAction } = require("./entityActions/user.action.js");

function handler(data, stream) {
  const inputMessage = data.toString();

  if (inputMessage === "00012sinitOKDBser") {
    console.log("Servicio enlazado al bus");
    return;
  }

  let idService, payload;
  try {
    idService = inputMessage.slice(5, 10);
    payload = inputMessage.slice(11);
  } catch (error) {
    console.error(error.message);
  }

  const [entity, action, ...params] = payload.split("|");

  if (idService === "DBser") {
    console.log({ inputMessage });
    switch (entity) {
      case "user":
        return executeUserAction(action, params, stream);
    }
  }
}

const sshTunnel = new SSHTunnel();
sshTunnel.connect(handler, "00010sinitDBser");
