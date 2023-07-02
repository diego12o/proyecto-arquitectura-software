const { handleOption } = require("./handle-option.js");
const prompt = require("prompt-sync")({ sigint: true });
const { optionsConfigUser, optionsConfigAdmin } = require("./constants.js");
const { ClientSSHTunnel } = require("../utils/clientsshTunnel.js");
const sshTunnel = new ClientSSHTunnel();

async function handlerClient(stream) {
  console.log("Tunel SSH implementado exitosamente\n");

  let isessResponse;
  try {
    isessResponse = await handleOption(
      stream,
      { es_admin: true },
      "isess",
      "isess",
      ["correo", "contraseña"]
    );
  } catch (err) {
    console.log(err.message);
    return;
  }

  const User = JSON.parse(isessResponse);

  const isAdmin = User.es_admin;
  const nameUser = isAdmin ? "Administrador" : "Alumno";

  console.log(`\n\nHola, ${nameUser}!`);
  console.log("Bienvenido a la plataforma de criticas UDP\n");
  console.log("Que opción deseas realizar?");

  while (true) {
    const optionsConfig = isAdmin ? optionsConfigAdmin : optionsConfigUser;

    console.log("\n\n");
    for (let i = 0; i < optionsConfig.length; i++) {
      console.log(`${i + 1}. ${optionsConfig[i].detail}`);
    }
    console.log(`0. Salir`);

    const op = prompt("\n\n");
    if (op === "0") {
      loop = false;
      continue;
    }

    const chosenOption = optionsConfig[op - 1];

    if (!chosenOption) {
      console.log("Opción inválida");
      continue;
    }

    const { detail, idService, action, requireParams } = chosenOption;
    console.log(`\n${detail}, por favor rellene los siguientes campos: \n`);
    try {
      await handleOption(stream, User, idService, action, requireParams);
    } catch (err) {
      console.log(err.message);
    }
  }
}

sshTunnel.connect(handlerClient);
