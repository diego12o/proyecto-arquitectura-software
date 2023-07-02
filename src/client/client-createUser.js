const { handleOption } = require("./handle-option.js");
const { optionsConfigAdmin } = require("./constants.js");
const { ClientSSHTunnel } = require("../utils/clientsshTunnel.js");
const sshTunnel = new ClientSSHTunnel();

async function handlerCreateUser(stream) {
  console.log({ optionsConfigAdmin });
  const chosenOption = optionsConfigAdmin[11];
  console.log({ chosenOption });

  const { detail, idService, action, requireParams } = chosenOption;
  console.log(`\n${detail}, por favor rellene los siguientes campos: \n`);
  await handleOption(
    stream,
    { es_admin: true },
    idService,
    action,
    requireParams
  );
}

sshTunnel.connect(handlerCreateUser);
