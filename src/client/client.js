const { formatMessageWithLengthPrefix } = require("../utils/messageFormatter");

require("dotenv").config();
const Client = require("ssh2").Client;
const prompt = require("prompt-sync")({ sigint: true });
const sshConfig = {
  host: "200.14.84.16",
  port: 8080,
  username: process.env.UDP_USERNAME,
  password: process.env.UDP_PASSWORD,
};
const targetHost = "localhost";
const targetPort = 5000;

// Crear una instancia de cliente SSH

console.log({ sshConfig });
const sshClient = new Client();

sshClient.on("ready", () => {
  // Configurar un canal de reenvío de puertos (túnel SSH)
  console.log("Conexion SSH establecida");

  sshClient.forwardOut(
    "127.0.0.1",
    0,
    targetHost,
    targetPort,
    async (err, stream) => {
      if (err) {
        console.error("Error en el canal de reenvío de puertos:", err);
        sshClient.end();
        return;
      }

      //TODO: Hacer una llamada al svUsuario, Iniciar sesion, y guardar la informacion del usuario en User
      //Que sera usada en las opciones del sistema.
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

          const op = prompt("");

          const RelleneElFormulario =
            "\n" +
            opcions[op - 1] +
            ", por favor rellene los siguientes campos:" +
            "\n";
          console.log(RelleneElFormulario);

          if (op == 1) {
            const id_profesor_curso = prompt( "Ingrese el id_profesor_curso: ");
            const comentario = prompt("Ingrese el comentario: ");
            const nota = prompt("Ingrese la nota: ");
            const rut_usuario = isAdmin
              ? prompt("Ingrese el rut del usuario: ")
              : User.rut;
            const fecha1 = new Date(Date.now()).toLocaleString().split(',')[0].replaceAll('/', '-');

            const timestamp = Date.now()
            const dateObj = new Date(timestamp);

            const year = dateObj.getFullYear();
            const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Se agrega +1 porque los meses en JavaScript van de 0 a 11
            const day = ('0' + dateObj.getDate()).slice(-2);

            const fecha = day+"-"+month+"-"+year

            const requestMessage = formatMessageWithLengthPrefix(
              "evalu|addEvaluation|" +
                id_profesor_curso +
                "|" +
                comentario +
                "|" +
                nota +
                "|" +
                fecha +
                "|" +
                rut_usuario
            );
            console.log({ requestMessage });
            stream.write(requestMessage);
            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                const SuccesMessage = "exito";
                const StatusMessage = x.slice(12, 12 + SuccesMessage.length);
                if (StatusMessage != SuccesMessage) {
                  console.log("Evaluacion realizada");
                } else {
                  console.log("Error realizando la evalaucion");
                }

                resolve();
              });
            });
          }

          if (op == 2) {
            const id_profesor_curso = prompt("Ingrese el id profesor curso: ");
            const requestMessage = formatMessageWithLengthPrefix(
              "evalu|seeAvg|" + id_profesor_curso
            );
            console.log({ requestMessage });
            stream.write(requestMessage);
            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                const SuccesMessage = "exito";
                const StatusMessage = x.slice(12, 12 + SuccesMessage.length);
                if (StatusMessage != SuccesMessage) {
                  const payload = x.slice(12 + SuccesMessage.length);
                  console.log("Promedio de evaluaciones: ", payload);
                } else {
                  console.log("Error obteniendo el promedio");
                }
                resolve();
              });
            });
          }

          if (op == 3) {
            const rut_alumno = prompt("Ingrese el rut: ");
            const requestMessage = formatMessageWithLengthPrefix(
              "evalu|seeEvaluation|" + rut_alumno
            );
            console.log({ requestMessage });
            stream.write(requestMessage);
            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                const SuccesMessage = "exito";
                const StatusMessage = x.slice(12, 12 + SuccesMessage.length);
                if (StatusMessage != SuccesMessage) {
                  const payload = x.slice(12 + SuccesMessage.length);
                  console.log("Evaluaciones realizadas: ", payload);
                } else {
                  console.log("Error obteniendo evaluaciones realizadas");
                }
                resolve();
              });
            });
          }

          if (op == 4) {
            const nota = prompt("Ingrese la nueva nota de la evaluacion: ");
            const rut_usuario = isAdmin
              ? prompt("Ingrese el rut del usuario: ")
              : User.rut;
            const comentario = prompt(
              "Ingrese el nuevo comentario de la evaluacion: "
            );
            const id_profesor_curso = prompt("Ingrese el id profesor curso: ");

            const requestMessage = formatMessageWithLengthPrefix(
              "evalu|editEvaluation" +
                "|" +
                nota +
                "|" +
                comentario +
                "|" +
                id_profesor_curso +
                "|" +
                rut_usuario
            );

            console.log({ requestMessage });
            stream.write(requestMessage);

            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                const SuccesMessage = "actualizado";
                const StatusMessage = x.slice(12, 12 + SuccesMessage.length);
                if (StatusMessage != SuccesMessage) {
                  console.log("Evaluacion actualizada");
                } else {
                  console.log("Error actualizando la evalaucion");
                }

                resolve();
              });
            });
          }

          if (op == 5) {
            const rut_usuario = isAdmin
              ? prompt("Ingrese el rut del usuario: ")
              : User.rut;
            const requestMessage = formatMessageWithLengthPrefix(
              "evalu|seeComments" + "|" + rut_usuario
            );

            console.log({ requestMessage });
            stream.write(requestMessage);

            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                const SuccesMessage = "exito";
                const StatusMessage = x.slice(12, 12 + SuccesMessage.length);
                if (StatusMessage != SuccesMessage) {
                  const payload = x.slice(12 + SuccesMessage.length);
                  console.log("Comentarios realizados: ", payload);
                } else {
                  console.log("Error obteniendo evaluaciones realizadas");
                }

                resolve();
              });
            });
          }

          if (op == 6) {
            const comentario = prompt("Ingrese el nombre del profesor: ");
            const nota = prompt("Ingrese la nota hacia el profesor: ");
            const rut_usuario = isAdmin
              ? prompt("Ingrese el rut del usuario: ")
              : User.rut;
            // const fecha = prompt("Ingrese el nombre del profesor: ");
            const fecha = new Date(Date.now()).toLocaleString().split(',')[0].replaceAll('/', '-');
            const requestMessage = formatMessageWithLengthPrefix(
              "evalu|updateCommentEvaluation|" +
                rut_usuario +  
                "|" +
                fecha +
                "|" +
                comentario
            );

            console.log({ requestMessage });
            stream.write(requestMessage);

            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                const SuccesMessage = "exito";
                const StatusMessage = x.slice(12, 12 + SuccesMessage.length);
                if (StatusMessage != SuccesMessage) {
                  console.log("Comentario actualizado: ");
                } else {
                  console.log(
                    "Error actualizando comentario de evaluación"
                  );
                }

                resolve();
              });
            });
          }

          if (op == 7) {
            const id_evaluation = prompt("Ingrese el id de la evaluación a eliminar: ");

            // se debe realizar una consulta en la bdd para saber si la
            // evaluación pertenece al usuario que intenta eliminarla

            const requestMessage = formatMessageWithLengthPrefix(
              "evalu|deleteEvaluation" +
              "|" +
              id_evaluation
            );

            console.log({ requestMessage });
            stream.write(requestMessage);

            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                const SuccesMessage = "exito";
                const StatusMessage = x.slice(12, 12 + SuccesMessage.length);
                if (StatusMessage != SuccesMessage) {
                  console.log("Evaluación eliminada ");
                } else {
                  console.log(
                    "Error eliminando evaluación"
                  );
                }

                resolve();
              });
            });
          }

          if (op == 8) {
            ///////////////////////////////////////////////
            // ACÁ CORRESPONDE CAMBIAR CONTRASEÑA SEGÚN MENU
            const rut_usuario = isAdmin
              ? prompt("Ingrese el rut del usuario: ")
              : User.rut;
            const fecha = prompt(
              "Ingrese la fecha en que realizaste la evaluacion(aaaa/mm/dd): "
            );
            const nota = prompt("Ingrese la nota de la evaluacion: ");
            const nuevo_comentario = "";
            const requestMessage = formatMessageWithLengthPrefix(
              "evalu|updateComent" +
                "|" +
                rut_usuario +
                "|" +
                fecha +
                "|" +
                nota +
                "|" +
                nuevo_comentario
            );

            console.log({ requestMessage });
            stream.write(requestMessage);

            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                const SuccesMessage = "exito";
                const StatusMessage = x.slice(12, 12 + SuccesMessage.length);
                if (StatusMessage != SuccesMessage) {
                  console.log("Comentarios actualizado: ");
                } else {
                  console.log(
                    "Error actualizando comentario de la evaluaciones"
                  );
                }

                resolve();
              });
            });
          }

          if (op == 8) {
            const updMail = isAdmin
              ? User.correo
              : prompt(
                  "Ingrese el correo del usuario que se actualizara contraseña: "
                );
            const newPassword = prompt(
              "Ingrese la fecha en que realizaste la evaluacion(aaaa/mm/dd): "
            );

            const requestMessage = formatMessageWithLengthPrefix(
              "usuar|update" + "|" + newPassword + "|" + updMail
            );

            console.log({ requestMessage });
            stream.write(requestMessage);

            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                const SuccesMessage = "actualizado";
                const StatusMessage = x.slice(12, 12 + SuccesMessage.length);
                if (StatusMessage != SuccesMessage) {
                  console.log("Contraseña actualizado: ");
                } else {
                  console.log("Error actualizando contraseña");
                }

                resolve();
              });
            });
          }

          if (isAdmin && op == 9) {
            const id_evaluation = prompt("Ingrese el id de la evaluación a eliminar: ");
            const rut_usuario = prompt("Ingrese su rut: ");
            const requestMessage = formatMessageWithLengthPrefix(
              "evalu|deleteEvaluationAdmin" +
              "|" +
              id_evaluation +
              "|" +
              rut_usuario
            );

            console.log({ requestMessage });
            stream.write(requestMessage);

            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                const SuccesMessage = "exito";
                const StatusMessage = x.slice(12, 12 + SuccesMessage.length);
                if (StatusMessage != SuccesMessage) {
                  console.log("Evaluación eliminada ");
                } else {
                  console.log("Error eliminando evaluación");
                }

                resolve();
              });
            });
          }

          if (isAdmin && op == 10) {
            const rut = prompt("Ingrese el rut del usuario a crear: ");
            const mail = prompt("Ingrese el correo del usuario a crear: ");
            const password = prompt(
              "Ingrese la constraseña del usuario a crear:"
            );
            const carrera = prompt("Ingrese la carrera del usuario:  ");
            const nombre = prompt("Ingrese el nombre del usuario: ");
            const ano = prompt("Ingrese el año de ingreso del usuario ");
            const tipo = prompt("Ingrese 'ADMIN' si sera admin ");
            const requestMessage = formatMessageWithLengthPrefix(
              "usuar|create" +
                "|" +
                rut +
                "|" +
                mail +
                "|" +
                password +
                "|" +
                carrera +
                "|" +
                nombre +
                "|" +
                ano +
                "|" +
                tipo ==
                "ADMIN"
            );

            console.log({ requestMessage });
            stream.write(requestMessage);

            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                const SuccesMessage = "exito";
                const StatusMessage = x.slice(12, 12 + SuccesMessage.length);
                if (StatusMessage != SuccesMessage) {
                  console.log("Usuario creado con exito: ");
                } else {
                  console.log("Error al crear usuario");
                }

                resolve();
              });
            });
          }

          if (isAdmin && op == 11) {
            const codigo = prompt(
              "Ingrese el codigo que tendra el nuevo curso: "
            );
            const carrera = prompt(
              "Ingrese el nombre de la carrera el cual pertenecera este curso: "
            );
            const nombre = prompt("Ingrese el nombre del curso:");

            const requestMessage = formatMessageWithLengthPrefix(
              "curso|create" + "|" + codigo + "|" + carrera + "|" + nombre
            );

            console.log({ requestMessage });
            stream.write(requestMessage);

            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                const SuccesMessage = "exito";
                const StatusMessage = x.slice(12, 12 + SuccesMessage.length);
                if (StatusMessage != SuccesMessage) {
                  console.log("Usuario creado con exito: ");
                } else {
                  console.log("Error al crear usuario");
                }

                resolve();
              });
            });
          }

          if (isAdmin && op == 12) {
            const nombre = prompt("Ingrese el nombre del profesor: ");
            const correo = prompt("Ingrese el nuevo correo: ");
            const requestMessage = formatMessageWithLengthPrefix(
              "profe|create" + "|" + nombre + "|" + correo
            );
            console.log({ requestMessage });
            stream.write(requestMessage);

            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                var datos = x.slice(12);
                if (datos == "exito") {
                  console.log("Usuario creado");
                } else {
                  console.log("Fracaso al hacer el usuario");
                }
                resolve();
              });
            });
          }

          if (isAdmin && op == 13) {
            console.log(RelleneElFormulario);
            const correo = prompt(
              "Ingrese el correo del profesor a eliminar: "
            );
            const requestMessage = formatMessageWithLengthPrefix(
              "profe|delete|" + correo
            );
            console.log({ requestMessage });
            stream.write(requestMessage);

            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                var datos = x.slice(12);

                if (datos == "eliminado") {
                  console.log("Profesor eliminado");
                } else {
                  console.log("Profesor NO eliminado");
                }
                resolve();
              });
            });
          }

          if (isAdmin && op == 14) {
            console.log(RelleneElFormulario);
            const id_profe = prompt("Ingrese el id del profesor a inscribir: ");
            const id_curso = prompt(
              "Ingrese el codigo del curso al cual se inscribira: "
            );
            const requestMessage = formatMessageWithLengthPrefix(
              "profe|enroll|" + id_curso + "|" + id_profe
            );
            console.log({ requestMessage });
            stream.write(requestMessage);

            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                var datos = x.slice(12);

                if (datos == "inscrito") {
                  console.log("Profesor inscrito");
                } else {
                  console.log("Profesor NO inscrito");
                }
                resolve();
              });
            });
          }

          if (op == 0) {
            console.log("Hasta la proxima!");
            loop = false;
          }
        })();
      }

      // Recibir datos desde el túnel SSH
      // Cerrar el túnel SSH y la conexión SSH cuando hayas terminado
      stream.on("close", () => {
        sshClient.end();
      });
    }
  );
});

sshClient.on("error", (err) => {
  console.log("Error en la conexión SSH:", err);
  sshClient.end();
});

// Conectar al servidor SSH
sshClient.connect(sshConfig);
