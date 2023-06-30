const {
  EvaluationRepository,
} = require("../../../repositories/evaluation.repository");
const {
  ProfesorCursoRepository,
} = require("../../../repositories/profesor-curso.repository");
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

    case "update": {
      const [id, correo, nombre] = params;
      console.log({ correo, nombre });
      const success = await profesorRepository.updateProfesor(
        id,
        correo,
        nombre
      );
      const messageToBus = success
        ? formatMessageWithLengthPrefix("DBserexito")
        : formatMessageWithLengthPrefix("DBserfracaso");

      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "delete": {
      const [correo] = params;
      const profesor = await profesorRepository.findProfesorByEmail(correo);

      if (!profesor) {
        const messageToBus = formatMessageWithLengthPrefix(
          "DBserfracasoNoxiste"
        );
        console.log({ messageToBus });
        return stream.write(messageToBus);
      }
      const deleted = await profesorRepository.deleteProfesor(profesor.id);

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
