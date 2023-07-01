const SSHTunnel = require("../utils/sshTunnel.js");
const { handleOption } = require("./handle-option.js");
const sshTunnel = new SSHTunnel();

async function handlerClient(data, stream) {
  let user;
  await (async function () {
    user = handleOption(stream, { isAdmin: false }, "isses", "isses", [
      "correo",
      "password",
    ]);
  })();
  console.log(user);

  const User = {
    rut: "123",
    correo: "admin@correo.com",
    isAdmin: true,
  };
  const isAdmin = User.isAdmin;

  console.log("Tunel SSH implementado exitosamente\n");
  console.log("\nHola, Administrador!");
  console.log("Bienvenido a la plataforma de criticas UDP\n");
  console.log("Que opcion deseas realizar?\n\n");
  var loop = true;
  while (loop) {
    await (async function () {
      const opcionsUsers = [
        "1. Evaluar un profesor",
        "2. Visualizar promedio de evaluacion de un profesor",
        "3. Visualizar evaluación que realizaste",
        "4. Editar evaluación que realizaste",
        "5. Visualizar comentarios a evaluaciones que realizastes",
        "6. Escribir comentario a una evaluacion que realizaste",
        "7. Eliminar una evaluacion que realizaste",
        "8. Cambiar contraseña",
      ];

      const opcionsAdmin = opcionsUsers.concat([
        "9. Eliminar cualquier comentario",
        "10. Crear un nuevo usuario",
        "11. Inscribir un nuevo curso",
        "12. Inscribir un nuevo profesor",
        "13. Eliminar un profesor",
        "14. Inscribir profesor a un curso",
      ]);

      const opcions = isAdmin ? opcionsAdmin : opcionsUsers;
      opcions.push("0. Salir\n\n");
      opcions.map((op) => console.log(op));

      const op = Int(prompt(""));

      const RelleneElFormulario = `\n${
        opcions[op - 1]
      }, por favor rellene los siguientes campos: \n`;
      console.log(RelleneElFormulario);

      if (op == 1) {
        const requiredParams = [
          "id_profesor_curso",
          "comentario",
          "nota",
          "fecha",
          "rut_usuario",
        ];
        await handleOption(
          stream,
          User,
          "evalu",
          "addEvaluation",
          requiredParams
        );
      }

      if (op == 2) {
        const requiredParams = ["id_profesor_curso"];
        await handleOption(stream, User, "evalu", "seeAvg", requiredParams);
      }

      if (op == 3) {
        const requiredParams = ["rut_usuario"];
        await handleOption(
          stream,
          User,
          "evalu",
          "seeEvaluation",
          requiredParams
        );
      }

      if (op == 4) {
        const requiredParams = [
          "nota",
          "comentario",
          "id_profesor_curso",
          "rut_usuario",
        ];
        await handleOption(
          stream,
          User,
          "evalu",
          "editEvaluation",
          requiredParams
        );
      }

      if (op == 5) {
        const requiredParams = ["rut_usuario"];
        await handleOption(
          stream,
          User,
          "evalu",
          "seeComments",
          requiredParams
        );
      }

      if (op == 6) {
        const requiredParams = ["rut_usuario", "fecha", "comentario"];
        await handleOption(
          stream,
          User,
          "evalu",
          "updateCommentEvaluation",
          requiredParams
        );
      }

      if (op == 7) {
        const requiredParams = ["id_evaluation"];
        await handleOption(
          stream,
          User,
          "evalu",
          "deleteEvaluation",
          requiredParams
        );
      }

      if (op == 8) {
        const requiredParams = [
          "rut_usuario",
          "fecha",
          "nota",
          "nuevo_comentario",
        ];
        await handleOption(
          stream,
          User,
          "evalu",
          "updateComent",
          requiredParams
        );
      }

      if (op == 8) {
        const requiredParams = ["new_password", "correo"];
        await handleOption(stream, User, "usuar", "update", requiredParams);
      }

      if (isAdmin && op == 9) {
        const requiredParams = ["id_evaluation", "rut_usuario"];
        await handleOption(
          stream,
          User,
          "evalu",
          "deleteEvaluationAdmin",
          requiredParams
        );
      }

      if (isAdmin && op == 10) {
        const requiredParams = [
          "rut",
          "mail",
          "password",
          "carreara",
          "nombre",
          "ano",
          "seraAdmin",
        ];
        await handleOption(stream, User, "usuar", "create", requiredParams);
      }

      if (isAdmin && op == 11) {
        const requiredParams = ["codigo", "carrera", "nombre"];
        await handleOption(stream, User, "curso", "create", requiredParams);
      }

      if (isAdmin && op == 12) {
        const requiredParams = ["nombre", "correo"];
        await handleOption(stream, User, "profe", "create", requiredParams);
      }

      if (isAdmin && op == 13) {
        const requiredParams = ["correo"];
        await handleOption(stream, User, "profe", "delete", requiredParams);
      }

      if (isAdmin && op == 14) {
        const requiredParams = ["id_profe", "id_curso"];
        await handleOption(stream, User, "profe", "enroll", requiredParams);
      }
    })();
  }
}

sshTunnel.connect(handlerClient, "");
