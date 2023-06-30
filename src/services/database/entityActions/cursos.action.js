const { CursoRepository } = require("../../../repositories/cursos.repository");
const {
  formatMessageWithLengthPrefix,
} = require("../../../utils/messageFormatter");

async function executeCursosAction(action, params, stream) {
  const cursoRepository = new CursoRepository();
  switch (action) {
    case "create": {
      const [codigo, carrera, nombre] = params;
      const success = await cursoRepository.addCourse(codigo, carrera, nombre);
      const messageToBus = success
        ? formatMessageWithLengthPrefix("DBserexito")
        : formatMessageWithLengthPrefix("DBserfracaso");

      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "update": {
      const [codigo, carrera, nombre] = params;
      const updated = await cursoRepository.updateCourse(
        codigo,
        carrera,
        nombre
      );
      const messageToBus = updated
        ? formatMessageWithLengthPrefix("DBseractualizado")
        : formatMessageWithLengthPrefix("DBserfracaso");
      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "delete": {
      const [codigo] = params;
      const deleted = await cursoRepository.deleteCourse(codigo);
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
