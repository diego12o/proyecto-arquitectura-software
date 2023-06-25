const {
  ProfesorRepository,
} = require("../../../repositories/profesor.repository");
const {
  formatMessageWithLengthPrefix,
} = require("../../../utils/messageFormatter");

async function excecuteProfesorAction(action, params, stream) {
  const profesorRepository = new ProfesorRepository();
  switch (action) {
    case "create": {
      const [correo, nombre] = params;
      console.log({ correo, nombre });
      const success = await profesorRepository.addProfesor(correo, nombre);
      const messageToBus = success
        ? formatMessageWithLengthPrefix("DBserexito")
        : formatMessageWithLengthPrefix("DBserfracaso");

      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "delete": {
      const [correo] = params;
      const deleted = await profesorRepository.deleteProfesor(correo);
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
  excecuteProfesorAction,
};
