const {
  EvaluationRepository,
} = require("../../../repositories/evaluation.repository");
const {
  formatMessageWithLengthPrefix,
} = require("../../../utils/messageFormatter");

async function executeEvaluationAction(action, params, stream) {
  const evaluationRepository = new EvaluationRepository();
  switch (action) {
    case "addEvaluation": {
      const [id_profesor_curso, comentario, nota, fecha, rut_alumno] = params;
      console.log({
        id_profesor_curso,
        id_profesor,
        comentario,
        nota,
        fecha,
        rut_alumno,
      });
      const success = await evaluationRepository.addEvaluation(
        id_profesor_curso,
        comentario,
        nota,
        fecha,
        rut_alumno
      );
      const messageToBus = success
        ? formatMessageWithLengthPrefix("DBserexito")
        : formatMessageWithLengthPrefix("DBserfracaso");

      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "seeAvg": {
      const [id_profesor_curso] = params;
      const avg = await evaluationRepository.seeAvg(id_profesor_curso);
      const messageToBus = avg
        ? formatMessageWithLengthPrefix("DBserexito")
        : formatMessageWithLengthPrefix("DBserfracaso");
      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "seeEvaluation": {
      const [rut] = params;
      const evaluations = await userRepository.deleteUser(rut);
      const messageToBus = evaluations
        ? formatMessageWithLengthPrefix("DBserexito")
        : formatMessageWithLengthPrefix("DBserfracaso");
      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "seeComments": {
      const [rut] = params;
      const comments = await evaluationRepository.seeComments(rut);
      const messageToBus = comments
        ? formatMessageWithLengthPrefix("DBserexito")
        : formatMessageWithLengthPrefix("DBserfracaso");
      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "editEvaluation": {
      const [nota, comentario, id_profesor_curso, rut_alumno] = params;
      const success = await evaluationRepository.editEvaluation(
        nota,
        comentario,
        id_profesor_curso,
        rut_alumno
      );
      const messageToBus = success
        ? formatMessageWithLengthPrefix("DBseractualizado")
        : formatMessageWithLengthPrefix("DBserfracaso");
      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "deleteEvaluation": {
      // RUT ALUMNO
      const [id_evaluation] = params;
      const success = await evaluationRepository.deleteEvaluation(
        id_evaluation
      );
      const messageToBus = success
        ? formatMessageWithLengthPrefix("DBsereliminado")
        : formatMessageWithLengthPrefix("DBserfracaso");
      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "deleteEvaluationAdmin": {
      // RUT ADMIN
      const [id_evaluation, rut_alumno] = params;
      const success = await evaluationRepository.deleteEvaluation(
        id_evaluation,
        rut_alumno
      );
      const messageToBus = success
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
  executeEvaluationAction,
};
