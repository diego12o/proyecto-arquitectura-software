const { formatMessageWithLengthPrefix } = require("../utils/messageFormatter");

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
      const a = "Hola";
      const b = "Bienvenido a la plataforma de criticas UDP";
      const c = "¿Que desea hacer?";
      const d = "Opciones: ";
      const e = "1. Registrar usuario";
      const f = "2. Cambiar contraseña";
      const g = "3. Eliminar usuario";
      const h = "4. Iniciar Sesion";
      const i = "5. Crear Profesor";
      const j = "6. Eliminar Profesor";
      const z = "0. Salir de la aplicacion";
      console.log(
        a,
        "\n",
        b,
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
        "\n",
        i,
        "\n",
        j,
        "\n",
        z,
        "\n"
      );
      const op = prompt("");
      if (op == 1) {
        console.log("\n");
        console.log(
          "Registro de Usuario, por favor rellene los siguientes campos:",
          "\n"
        );
        const rut = prompt("Ingrese su rut: ");
        const correo = prompt("Ingrese su correo: ");
        const contrasena = prompt("Ingrese su contraseña: ");
        const carrera = prompt("Ingrese la carrera a la que pertenece: ");
        const nombre = prompt("Ingrese su nombre: ");
        const ano_ingreso = prompt(
          "Ingrese su año de ingreso a la universidad: "
        );
        const es_admin = false; // Definido por defecto
        const requestMessage =
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
          const x = data.toString();
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

      if (op == 3) {
        console.log("\n");
        console.log(
          "Eliminar Usuario, por favor rellene los siguientes campos:",
          "\n"
        );
        const correo = prompt("Ingrese su correo: ");
        const contrasena = prompt("Ingrese su contraseña: ");
        const rut = prompt("Ingrese su rut: ");
        const requestMessage =
          "00011usuar|delete" + "|" + rut + "|" + correo + "|" + contrasena;
        console.log({ requestMessage });
        stream.write(requestMessage);
        stream.on("data", (data) => {
          const x = data.toString();
          console.log({ messageResponse: x });

          var datos = x.slice(12);

          if (datos == "eliminado") {
            console.log("Usuario Eliminado");
          } else {
            console.log("Usuario NO eliminado");
          }
        });
      }

      if (op == 4) {
        console.log("\n");
        console.log(
          "Inicio de Sesion, por favor rellene los siguientes campos: ",
          "\n"
        );
        const correo = prompt("Ingrese su correo: ");
        const contrasena = prompt("Ingrese su contraseña: ");
        const requestMessage = "00005isess" + "|" + correo + "|" + contrasena;
        console.log({ requestMessage });
        stream.write(requestMessage);
        stream.on("data", (data) => {
          const x = data.toString();
          console.log({ messageResponse: x });
          var datos = x.slice(12);
          if (datos == "existe") {
            console.log("Sesion iniciada");
          } else {
            console.log("Error al iniciar sesion");
          }
        });
      }

      if (op == 5) {
        console.log("\n");
        console.log(
          "Crear Profesor, por favor rellene los siguientes campos: ",
          "\n"
        );
        const nombre = prompt("Ingrese nombre del nuevo profesor: ");
        const correo = prompt("Ingrese correo del nuevo profesor: ");
        const requestMessage = formatMessageWithLengthPrefix(
          "profe" + "|profesor|create|" + correo + "|" + nombre
        );
        console.log({ requestMessage });
        stream.write(requestMessage);
        stream.on("data", (data) => {
          const x = data.toString();
          console.log({ messageResponse: x });
          var datos = x.slice(12);
          if (datos == "exito") {
            console.log("Profesor creado");
          } else {
            console.log("Error al crear Profesor");
          }
        });
      }

      if (op == 6) {
        console.log("\n");
        console.log(
          "Eliminar Profesor, por favor rellene los siguientes campos: ",
          "\n"
        );
        const correo = prompt("Ingrese el correo del profesor a eliminar: ");

        const requestMessage = formatMessageWithLengthPrefix(
          "profe" + "|profesor|delete|" + correo
        );
        console.log({ requestMessage });
        stream.write(requestMessage);
        stream.on("data", (data) => {
          const x = data.toString();
          console.log({ messageResponse: x });
          var datos = x.slice(12);
          if (datos == "eliminado") {
            console.log("Profesor eliminado");
          } else {
            console.log("Error al eliminar Profesor");
          }
        });
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
