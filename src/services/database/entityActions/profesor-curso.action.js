const {
  ProfesorCursoRepository,
} = require("../../../repositories/profesor-curso.repository");
const {
  formatMessageWithLengthPrefix,
} = require("../../../utils/messageFormatter");

async function excecuteProfesorCursoAction(action, params, stream) {
  const profesorCursoRepository = new ProfesorCursoRepository();

  switch (action) {
    case "enroll": {
      const [id_profesor, codigo_curso] = params;
      console.log({ codigo_curso, id_profesor });
      const success = await profesorCursoRepository.addProfesorCurso(
        codigo_curso,
        id_profesor
      );
      const messageToBus = success
        ? formatMessageWithLengthPrefix("DBserexito")
        : formatMessageWithLengthPrefix("DBserfracaso");

      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    default:
      console.log("Acción desconocida:", action);
  }
}

module.exports = {
  excecuteProfesorCursoAction,
};
