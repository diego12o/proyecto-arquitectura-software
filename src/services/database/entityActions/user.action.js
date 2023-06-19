const UserRepository = require("../../../repositories/user.repository");

async function executeUserAction(action, params, stream) {
  const userRepository = new UserRepository();

  switch (action) {
    case "create":
      const [rut, mail, password, carrera, nombre, ano_ingreso, tipo] = params;
      const success = await userRepository.addUser(
        rut,
        mail,
        password,
        carrera,
        nombre,
        ano_ingreso,
        tipo
      );
      stream.write(
        success
          ? formatMessageWithLengthPrefix("DBserexito")
          : formatMessageWithLengthPrefix("DBserfracaso")
      );
      break;

    case "update":
      const [updPassword, updMail] = params;
      const updated = await userRepository.changePassword(updPassword, updMail);
      stream.write(
        updated
          ? formatMessageWithLengthPrefix("DBseractualizado")
          : formatMessageWithLengthPrefix("DBserfracaso")
      );
      break;

    case "delete":
      const [_, __, delRut] = params;
      const deleted = await userRepository.deleteUser(delRut);
      stream.write(
        deleted
          ? formatMessageWithLengthPrefix("DBsereliminado")
          : formatMessageWithLengthPrefix("DBserfracaso")
      );
      break;

    case "isess":
      const [isessMail, isessPassword] = params;
      const usuario = await userRepository.findUserByMail(isessMail);
      stream.write(
        usuario && usuario.password === isessPassword
          ? formatMessageWithLengthPrefix("DBserexiste")
          : formatMessageWithLengthPrefix("DBsernoexiste")
      );
      break;

    default:
      console.log("Acción desconocida:", action);
  }
}

module.exports = {
  executeUserAction,
};
