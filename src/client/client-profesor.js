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

      console.log("Tunel SSH implementado exitosamente");
      const a = "Hola";
      const b = "Bienvenido a la plataforma de criticas UDP";
      console.log(a, "\n", b);
      var loop = true;
      while (loop) {
        await (async function () {
          console.log("¿Que desea hacer?");
          console.log("Opciones: ");
          const e = "1. Crear Profesor";
          const f = "2. Eliminar Profesor";
          const g = "3. Inscribir profesor a curso";
          const h = "0. Salir";
          console.log(
            "\n",
            c,
            "\n",
            d,
            "\n",
            e,
            "\n",
            f,
            "\n",
            g,
            "\n",
            h,
            "\n"
          );
          const op = prompt("");

          if (op == 1) {
            console.log("\n");
            console.log(
              "Crear profesor, por favor rellene los siguientes campos:",
              "\n"
            );
            const nombre = prompt("Ingrese el nombre del profesor: ");
            const correo = prompt("Ingrese el nuevo correo correo: ");
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

          if (op == 2) {
            console.log("\n");
            console.log(
              "Eliminar profesor, por favor rellene los siguientes campos:",
              "\n"
            );
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

          if (op == 3) {
            console.log("\n");
            console.log(
              "Inscribir profesor a curso, por favor rellene los siguientes campos:",
              "\n"
            );
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
