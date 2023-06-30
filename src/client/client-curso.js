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
          const c = "¿Que desea hacer?";
          const d = "Opciones: ";
          const e = "1. Crear Cuso";
          const f = "2. Actualizar Curso";
          const g = "3. Eliminar curso";
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
              "Crear curso, por favor rellene los siguientes campos:",
              "\n"
            );
            const codigo = prompt("Ingrese el codigo de este nuevo curso: ");
            const carrera = prompt("Ingrese la carrea que tendra este curso: ");
            const nombre = prompt("Ingrese nombre del curso: ");
            const requestMessage = formatMessageWithLengthPrefix(
              "curso|create" + "|" + codigo + "|" + carrera + "|" + nombre
            );
            console.log({ requestMessage });
            stream.write(requestMessage);

            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                var datos = x.slice(12);
                if (datos == "exito") {
                  console.log("Curso creado");
                } else {
                  console.log("Fracaso al hacer el curso");
                }
                resolve();
              });
            });
          }

          if (op == 2) {
            console.log("\n");
            console.log(
              "Actualizar curso, por favor rellene los siguientes campos:",
              "\n"
            );
            const codigo = prompt("Ingrese el codigo del curso a actualizar ");
            const carrera = prompt(
              "Ingrese la nueva carrea que tendra este curso: "
            );
            const nombre = prompt("Ingrese el nuevo nombre del curso: ");
            const requestMessage = formatMessageWithLengthPrefix(
              "curso|update" + "|" + codigo + "|" + carrera + "|" + nombre
            );
            console.log({ requestMessage });
            stream.write(requestMessage);

            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                var datos = x.slice(12);

                if (datos == "actualizado") {
                  console.log("Curso actualizado");
                } else {
                  console.log("Curso NO actualizado");
                }
                resolve();
              });
            });
          }

          if (op == 3) {
            console.log("\n");
            console.log(
              "Eliminar curso, por favor rellene los siguientes campos:",
              "\n"
            );
            const id_curso = prompt("Ingrese el id del curso a eliminar: ");

            const requestMessage = formatMessageWithLengthPrefix(
              "profe|delete|" + id_curso
            );
            console.log({ requestMessage });
            stream.write(requestMessage);

            await new Promise((resolve, reject) => {
              stream.once("data", (data) => {
                const x = data.toString();
                console.log({ messageResponse: x });

                var datos = x.slice(12);

                if (datos == "eliminado") {
                  console.log("Curso eliminado");
                } else {
                  console.log("Curso NO eliminado");
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
