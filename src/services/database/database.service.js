const SSHTunnel = require("../../utils/sshTunnel.js");
const {
  excecuteProfesorAction,
} = require("./entityActions/profesor.action.js");
const { executeUserAction } = require("./entityActions/user.action.js");
const {
  executeEvaluationAction,
} = require("./entityActions/evaluation.action.js");
const { executeCursosAction } = require("./entityActions/cursos.action.js");
const {
  excecuteProfesorCursoAction,
} = require("./entityActions/profesor-curso.action.js");

function handler(data, stream) {
  const inputMessage = data.toString();

  if (inputMessage === "00012sinitOKDBser") {
    console.log("Servicio enlazado al bus");
    return;
  }

  let idService, payload;
  try {
    idService = inputMessage.slice(5, 10);
    payload = inputMessage.slice(11);
  } catch (error) {
    console.error(error.message);
  }

  const [entity, action, ...params] = payload.split("|");

  if (idService === "DBser") {
    console.log({ inputMessage });
    switch (entity) {
      case "user":
        return executeUserAction(action, params, stream);
      case "profesor":
        return excecuteProfesorAction(action, params, stream);
      case "profesorCurso":
        return excecuteProfesorCursoAction(action, params, stream);
      case "evaluation":
        return executeEvaluationAction(action, params, stream);
      case "cursos":
        return executeCursosAction(action, params, stream);
    }
  }
}

const sshTunnel = new SSHTunnel();
sshTunnel.connect(handler, "00010sinitDBser");
