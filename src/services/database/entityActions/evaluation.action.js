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
      const [id_profesor_curso, comentario, nota, fecha, rut_usuario] = params;
      console.log({
        id_profesor_curso,
        comentario,
        nota,
        fecha,
        rut_usuario,
      });
      const success = await evaluationRepository.addEvaluation(
        id_profesor_curso,
        comentario,
        nota,
        fecha,
        rut_usuario
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
        ? formatMessageWithLengthPrefix("DBserexito|" + avg)
        : formatMessageWithLengthPrefix("DBserfracaso");
      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "seeEvaluation": {
      const [rut_usuario] = params;
      const evaluations = await evaluationRepository.seeEvaluation(rut_usuario);
      const messageToBus = evaluations
        ? formatMessageWithLengthPrefix("DBserexito|" + evaluations)
        : formatMessageWithLengthPrefix("DBserfracaso");
      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "editEvaluation": {
      const [nota, comentario, id_profesor_curso, rut_usuario] = params;
      const success = await evaluationRepository.editEvaluation(
        nota,
        comentario,
        id_profesor_curso,
        rut_usuario
      );
      const messageToBus = success
        ? formatMessageWithLengthPrefix("DBseractualizado")
        : formatMessageWithLengthPrefix("DBserfracaso");
      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "deleteEvaluation": {
      const [id_evaluation, rut_usuario] = params;
      const success = await evaluationRepository.deleteEvaluation(
        id_evaluation,
        rut_usuario
      );
      const messageToBus = success
        ? formatMessageWithLengthPrefix("DBsereliminado")
        : formatMessageWithLengthPrefix("DBserfracaso");
      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "seeComments": {
      const [rut_usuario] = params;
      const comments = await evaluationRepository.seeComments(rut_usuario);
      const messageToBus = comments
        ? formatMessageWithLengthPrefix("DBserexito|" + comments)
        : formatMessageWithLengthPrefix("DBserfracaso");
      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "updateComent": {
      const [rut_usuario, fecha, nuevo_comentario] = params;
      const comments = await evaluationRepository.updateComment(
        rut_usuario,
        fecha,
        nuevo_comentario
      );
      const messageToBus = comments
        ? formatMessageWithLengthPrefix("DBserexito")
        : formatMessageWithLengthPrefix("DBserfracaso");
      console.log({ messageToBus });
      return stream.write(messageToBus);
    }

    case "deleteComentario": {
      const [rut_usuario, fecha] = params;
      const deletedComment = "";
      const success = await evaluationRepository.updateComment(
        rut_usuario,
        fecha,
        deletedComment
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
