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
      const [codigo_curso, id_profesor] = params;
      console.log({ codigo_curso, id_profesor });
      const success = await profesorCursoRepository.addProfesorCurso(
        codigo_curso,
        id_profesor
      );
      const messageToBus = success
        ? formatMessageWithLengthPrefix("DBserinscrito")
        : formatMessageWithLengthPrefix("DBsernoinscrito");

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
