const { enc } = require("../utils/encriptado");

async function handleOption(stream, user, idService, action, params) {
  const prompt = generatePrompt(params, user).join("|");
  const requestMessage = formatMessageWithLengthPrefix(
    `${idService}|${action}|${prompt}`
  );

  console.log({ requestMessage });
  stream.write(requestMessage);

  return await handleServerResponse(stream, action);
}

function generatePrompt(params, user) {
  return params.map((param) => {
    if ((param === "rut_usuario" || param === "correo") && !user.isAdmin) {
      return user.rut;
    }
    if (param === "seraAdmin") {
      return prompt(`Ingrese ${param}: `) === "ADMIN";
    }
    if (param === "password") {
      return enc(prompt(`Ingrese ${param}: `));
    }

    return prompt(`Ingrese ${param}: `);
  });
}

async function handleServerResponse(stream, action) {
  await new Promise((resolve, reject) => {
    stream.once("data", (data) => {
      const response = data.toString();
      console.log({ messageResponse: response });

      const isSuccess = response.startsWith("exito");
      const payload = response.slice("exito".length);

      if (isSuccess) {
        console.log(`La accion: ${action} se realizo con exito. ${payload}`);
        return payload;
      } else {
        console.log(`Error al realizar la accion: ${action}`);
      }

      resolve();
    });
  });
}

module.exports = { handleOption };
