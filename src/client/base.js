const { formatMessageWithLengthPrefix } = require("../utils/messageFormatter");
const token = require("./token");
require("dotenv").config();

const Client = require("ssh2").Client;
const prompt = require("prompt-sync")({ sigint: true });

// Establecer la información de conexión al servidor SSH
const sshConfig = {
  host: "200.14.84.16",
  port: 8080,
  username: process.env.UDP_USERNAME,
  password: process.env.UDP_PASSWORD,
};
// Establecer la información de conexión al servidor final
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
    (err, stream) => {
      if (err) {
        console.error("Error en el canal de reenvío de puertos:", err);
        sshClient.end();
        return;
      }
      console.log("Tunel SSH implementado exitosamente");
      let op = 1;
      while (op != 0) {
        if (localStorage.getItem("token") === undefined) {
          let consultar = [
            "Hola",
            "Bienvenido a la plataforma de criticas UDP",
            "¿Que desea hacer?",
            "Opciones: ",
            "1. Registrar usuario",
            "2. Iniciar Sesion",
            "3. Olvide mi contraseña",
            "0. Salir de la plataforma",
          ];
          for (let i of consultar) {
            console.log(consultar[i]);
          }
          op = prompt("");
          if (op == 1) {
            console.log("\n");
            console.log(
              "Registro de Usuario, por favor rellene los siguientes campos:",
              "\n"
            );
            let rut = prompt("Ingrese su rut: ");
            let correo = prompt("Ingrese su correo: ");
            let contrasena = prompt("Ingrese su contraseña: ");
            let carrera = prompt("Ingrese la carrera a la que pertenece: ");
            let nombre = prompt("Ingrese su nombre: ");
            let ano_ingreso = prompt(
              "Ingrese su año de ingreso a la universidad: "
            );
            let es_admin = false; // Definido por defecto
            let requestMessage =
              "00011usuar|create" +
              "|" +
              rut +
              "|" +
              correo +
              "|" +
              contrasena +
              "|" +
              carrera +
              "|" +
              nombre +
              "|" +
              ano_ingreso +
              "|" +
              es_admin;
            console.log({ requestMessage });
            stream.write(requestMessage);
            stream.on("data", (data) => {
              let x = data.toString();
              console.log({ messageResponse: x });

              var datos = x.slice(12);
              if (datos == "exito") {
                console.log("Usuario creado");
              } else {
                console.log("Fracaso al hacer el usuario");
              }
            });
          }

          if (op == 2) {
            console.log("\n");
            console.log(
              "Inicio de Sesion, por favor rellene los siguientes campos: ",
              "\n"
            );
            let correo = prompt("Ingrese su correo: ");
            let contrasena = prompt("Ingrese su contraseña: ");
            let requestMessage = "00005isess" + "|" + correo + "|" + contrasena;
            console.log({ requestMessage });
            stream.write(requestMessage);
            stream.on("data", (data) => {
              let x = data.toString();
              console.log({ messageResponse: x });
              var datos = x.slice(12);
              if (datos == "existe") {
                console.log("Sesion iniciada");
              } else {
                console.log("Error al iniciar sesion");
              }
            });
          }
          if (op == 3) {
            if (op == 2) {
              console.log("\n");
              console.log(
                "Actualizacion de Contraseña, por favor rellene los siguientes campos:",
                "\n"
              );
              const correo = prompt("Ingrese su correo: ");
              const contrasena = prompt("Ingrese su contraseña: ");
              const requestMessage =
                "00011usuar|update" + "|" + contrasena + "|" + correo;
              console.log({ requestMessage });
              stream.write(requestMessage);
              stream.on("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                var datos = x.slice(12);

                if (datos == "Actualizado") {
                  console.log("Contraseña actualizada");
                } else {
                  console.log("Contraseña NO actualizada");
                }
              });
            }
          }
          if (op == 0) {
            console.log("\n");
            console.log("Saliendo de la aplicacion: ");
          }
        } else {
          if (localStorage.getItem("user") === "ADMIN") {
            //usuario admin ya logeado
            let consultar = [
              "Bienvenido de vuelta a la plataforma de criticas UDP",
              "¿Que desea hacer?",
              "Opciones: ",
              "1. Cambiar contraseña",
              "2. Cerrar Sesion",
              "3. Agregar Curso",
              "4. Editar Curso",
              "5. Eliminar Curso",
              "6. Agregar Profesor",
              "7. Vincular profesor a curso",
              "8. Editar profesor",
              "9. Eliminar profesor",
              "10. Eliminar Usuario",
              "0. Salir de la plataforma",
            ];
            for (let i of consultar) {
              console.log(consultar[i]);
            }
            op = prompt("");
            if (op == 0) {
              console.log("\n");
              console.log("Saliendo de la aplicacion: ");
            }
            if (op == 1) {
              console.log("\n");
              console.log(
                "Actualizacion de Contraseña, por favor rellene los siguientes campos:",
                "\n"
              );
              const correo = prompt("Ingrese su correo: ");
              const contrasena = prompt("Ingrese su contraseña: ");
              const requestMessage =
                "00011usuar|update" + "|" + contrasena + "|" + correo;
              console.log({ requestMessage });
              stream.write(requestMessage);
              stream.on("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                var datos = x.slice(12);

                if (datos == "actualizado") {
                  console.log("Contraseña actualizada");
                } else {
                  console.log("Contraseña NO actualizada");
                }
              });
            }
            if (op == 2) {
              console.log("\n");
              localStorage.clear();
              console.log("Saliendo de la sesion: ");
            }
            if (op == 3) {
              console.log("\n");
              console.log(
                "Creacion de curso, por favor rellene los siguientes campos:",
                "\n"
              );
              const codigo = prompt("Ingrese el codigo del curso: ");
              const carrera = prompt(
                "Ingrese la carrera en la que se imparte: "
              );
              const nombre = prompt("Ingrese el nombre del curso: ");
              const requestMessage =
                "00011curso|create" +
                "|" +
                codigo +
                "|" +
                carrera +
                "|" +
                nombre;
              console.log({ requestMessage });
              stream.write(requestMessage);
              stream.on("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                var datos = x.slice(12);

                if (datos == "exito") {
                  console.log("Curso creado con exito");
                } else {
                  console.log("No se pudo crear el curso");
                }
              });
            }
            if (op == 4) {
              console.log("\n");
              console.log(
                "Actualizacion de Curso, por favor rellene los siguientes campos:",
                "\n"
              );
              const codigo = prompt("Ingrese el codigo del curso: ");
              const nombre = prompt("Ingrese el nuevo nombre del curso: ");
              const requestMessage =
                "00011curso|update" + "|" + nombre + "|" + codigo;
              console.log({ requestMessage });
              stream.write(requestMessage);
              stream.on("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                var datos = x.slice(12);

                if (datos == "actualizado") {
                  console.log("Curso actualizada");
                } else {
                  console.log("Curso NO actualizada");
                }
              });
            }
            if (op == 5) {
              console.log("\n");
              console.log(
                "Eliminacion de curso, por favor rellene los siguientes campos:",
                "\n"
              );
              const codigo = prompt("Ingrese el codigo del curso: ");
              const requestMessage = "00011curso|delete" + "|" + codigo;
              console.log({ requestMessage });
              stream.write(requestMessage);
              stream.on("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                var datos = x.slice(12);

                if (datos == "eliminado") {
                  console.log("Curso eliminado");
                } else {
                  console.log("Curso NO eliminado");
                }
              });
            }
          } else {
            //usuario alumno ya logeado
            let consultar = [
              "Bienvenido de vuelta a la plataforma de criticas UDP",
              "¿Que desea hacer?",
              "Opciones: ",
              "1. Cambiar contraseña",
              "2. Cerrar Sesion",
              "3. Ver Cursos",
              "4. Ver mis comentarios",
              "0. Salir de la plataforma",
            ];
            for (let i of consultar) {
              console.log(consultar[i]);
            }
            op = prompt("");
            if (op == 0) {
              console.log("\n");
              console.log("Saliendo de la aplicacion: ");
            }
            if (op == 1) {
              console.log("\n");
              console.log(
                "Actualizacion de Contraseña, por favor rellene los siguientes campos:",
                "\n"
              );
              const correo = prompt("Ingrese su correo: ");
              const contrasena = prompt("Ingrese su contraseña: ");
              const requestMessage =
                "00011usuar|update" + "|" + contrasena + "|" + correo;
              console.log({ requestMessage });
              stream.write(requestMessage);
              stream.on("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                var datos = x.slice(12);

                if (datos == "actualizado") {
                  console.log("Contraseña actualizada");
                } else {
                  console.log("Contraseña NO actualizada");
                }
              });
            }
            if (op == 2) {
              console.log("\n");
              localStorage.clear();
              console.log("Saliendo de la sesion: ");
            }
            if (op == 3) {
              console.log("Lista de Cursos disponibles en UDP");
              //necesito la lista de curso para ponerla
              let curso = prompt("");
              //aca se busca el curso y luego se muestran los profesores que dan el ramo
              //ya con los profesores se abre un menu de 6 opciones: 1. ver evaluaciones 2. ver comentarios  3. ver promedio 4.dejar comentario 5.dejar evaluacion 6.atras
            }
            if (op == 4) {
              console.log("Mis comentarios y evaluaciones");
              //necesito la lista de evaluaciones para ponerla
              let evaluacion = prompt("");
              //se elige la evaluacion y ofrece 5 opciones: cambiar evaluacion, cambiar comentario, eliminar evaluacion, eliminar comentario, atras (quizas necesite un ciclo do while)
            }
          }
        }
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
