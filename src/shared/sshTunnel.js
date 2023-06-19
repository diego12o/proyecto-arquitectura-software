const { sshConfig, targetHost, targetPort } = require("../config/sshConfig");

const Client = require("ssh2").Client;

class SSHTunnel {
  constructor() {
    this.sshConfig = sshConfig;
    this.targetHost = targetHost;
    this.targetPort = targetPort;
    this.sshClient = new Client();
  }

  connect(onDataCallback, initMessageService) {
    this.sshClient.on("ready", () => {
      console.log("Conexion SSH establecida");

      this.sshClient.forwardOut(
        "127.0.0.1",
        0,
        this.targetHost,
        this.targetPort,
        (err, stream) => {
          if (err) {
            console.error("Error en el canal de reenvío de puertos:", err);
            this.sshClient.end();
            return;
          }
          stream.write(initMessageService);
          stream.on("data", onDataCallback(data, err, stream));

          stream.on("close", () => {
            this.sshClient.end();
          });
        }
      );
    });

    this.sshClient.on("error", (err) => {
      console.log("Error en la conexión SSH:", err);
      this.sshClient.end();
    });

    this.sshClient.connect(this.sshConfig);
  }
}

module.exports = SSHTunnel;
