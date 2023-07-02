const prompt = require("prompt-sync")({ sigint: true });
const { enc } = require("../utils/encriptado");
const { formatMessageWithLengthPrefix } = require("../utils/messageFormatter");

async function handleOption(stream, user, idService, action, params) {
  const prompt = generatePrompt(params, user).join("|");
  const requestMessage = formatMessageWithLengthPrefix(
    `${idService}|${action}|${prompt}`
  );

  console.log({ requestMessage });
  stream.write(requestMessage);

  return new Promise((resolve, reject) => {
    stream.once("data", async (data) => {
      const response = data.toString();
      console.log({ messageResponse: response });

      const isSuccess = response.includes("exito");
      const payload = response.slice(18);

      if (isSuccess) {
        console.log(`La accion: ${action} se realizo con exito. ${payload}`);
        resolve(payload);
      } else {
        console.log(`Error al realizar la accion: ${action}`);
        reject(new Error(`Error al realizar la accion: ${action}`));
      }
    });
  });
}

function generatePrompt(params, user) {
  return params.map((param) => {
    if ((param === "rut_usuario" || param === "correo") && !user.es_admin) {
      return user.rut;
    }
    if (param === "seraAdmin") {
      return prompt(`Ingrese "ADMIN" si el usuario ${param}: `) === "ADMIN";
    }
    if (param === "contraseña" || param === "nueva_contraseña") {
      const contraseña = prompt(`Ingrese ${param}: `);
      console.log({ contraseña });
      return enc(contraseña);
    }

    return prompt(`Ingrese ${param}: `);
  });
}

module.exports = { handleOption };
