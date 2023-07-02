const { UserRepository } = require("../../../repositories/user.repository");
const {
  formatMessageWithLengthPrefix,
} = require("../../../utils/messageFormatter");

async function executeUserAction(action, params, stream) {
  const userRepository = new UserRepository();
  switch (action) {
    case "create": {
      const [rut, correo, contraseña, carrera, nombre, ano_ingreso, tipo] =
        params;
      console.log({
        rut,
        correo,
        contraseña,
        carrera,
        nombre,
        ano_ingreso,
        tipo,
      });
      const success = await userRepository.addUser(
        rut,
        correo,
        contraseña,
        carrera,
        nombre,
        ano_ingreso,
        tipo
      );
      const messageToBus = success
        ? formatMessageWithLengthPrefix("DBserexito")
        : formatMessageWithLengthPrefix("DBserfracaso");

      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "changePassword": {
      const [updPassword, updMail] = params;
      const updated = await userRepository.changePassword(updPassword, updMail);
      const messageToBus = updated
        ? formatMessageWithLengthPrefix("DBserexito")
        : formatMessageWithLengthPrefix("DBserfracaso");
      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "delete": {
      const [delRut] = params;
      const deleted = await userRepository.deleteUser(delRut);
      const messageToBus = deleted
        ? formatMessageWithLengthPrefix("DBserexito")
        : formatMessageWithLengthPrefix("DBserfracaso");
      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "isess": {
      const [isessMail, isessPassword] = params;
      const usuario = await userRepository.findUserByMail(isessMail);
      const messageToBus =
        usuario && usuario?.contrasena === isessPassword
          ? formatMessageWithLengthPrefix(
              "DBserexito|" + JSON.stringify(usuario)
            )
          : formatMessageWithLengthPrefix("DBserfracaso");
      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    default:
      console.log("Acción desconocida:", action);
  }
}

module.exports = {
  executeUserAction,
};
