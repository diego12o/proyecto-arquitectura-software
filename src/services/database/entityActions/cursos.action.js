const { UserRepository } = require("../../../repositories/cursos.repository");
const {
  formatMessageWithLengthPrefix,
} = require("../../../utils/messageFormatter");

async function executeCursosAction(action, params, stream) {
  const userRepository = new UserRepository();
  switch (action) {
    case "create": {
      const [codigo, carrera, nombre] = params;
      const success = await userRepository.addCourse(
        codigo, carrera, nombre
      );
      const messageToBus = success
        ? formatMessageWithLengthPrefix("DBserexito")
        : formatMessageWithLengthPrefix("DBserfracaso");

      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "update": {
      const [nombre, codigo] = params;
      const updated = await userRepository.changePassword(updPassword, updMail);
      const messageToBus = updated
        ? formatMessageWithLengthPrefix("DBseractualizado")
        : formatMessageWithLengthPrefix("DBserfracaso");
      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "delete": {
      const [_, __, codigo] = params;
      const deleted = await userRepository.deleteCourse(codigo);
      const messageToBus = deleted
        ? formatMessageWithLengthPrefix("DBsereliminado")
        : formatMessageWithLengthPrefix("DBserfracaso");
      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    default:
      console.log("Acción desconocida:", action);
  }
}

module.exports = {
    executeCursosAction,
};
