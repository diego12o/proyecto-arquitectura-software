const SSHTunnel = require("../utils/sshTunnel.js");
const { handleOption } = require("./handle-option.js");
const sshTunnel = new SSHTunnel();
const { optionsConfigUser, optionsConfigAdmin } = require("./constants.js");

async function handlerClient(data, stream) {
  let user = await handleOption(stream, { isAdmin: false }, "isses", "isses", [
    "correo",
    "contraseña",
  ]);
  console.log(user);

  const isAdmin = user.isAdmin;
  const nameUser = isAdmin ? "Administrador" : "Alumno";

  console.log("Tunel SSH implementado exitosamente\n");
  console.log(`Hola, ${nameUser}!`);
  console.log("Bienvenido a la plataforma de criticas UDP\n");
  console.log("Que opción deseas realizar?\n\n");

  while (true) {
    const optionsConfig = isAdmin ? optionsConfigAdmin : optionsConfigUser;

    console.log(`0. Salir`);

    for (let i = 0; i < optionsConfig.length; i++) {
      console.log(`${i + 1}. ${optionsConfig[i].detail}`);
    }

    const op = prompt("");
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
    await handleOption(stream, user, idService, action, requireParams);
  }
}

sshTunnel.connect(handlerClient, "");
