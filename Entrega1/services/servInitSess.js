const Client = require('ssh2').Client;
// Establecer la información de conexión al servidor SSH
const sshConfig = {
  host: '200.14.84.16',
  port: 8080,
  username: '123',
  password: '123'
};
// Establecer la información de conexión al servidor final
const targetHost = 'localhost';
const targetPort = 5000;
// Crear una instancia de cliente SSH
const sshClient = new Client();

sshClient.on('ready', () => {
  // Configurar un canal de reenvío de puertos (túnel SSH)
  console.log("Conexion SSH establecida");

    sshClient.forwardOut('127.0.0.1', 0, targetHost, targetPort, (err, stream) => {
        if (err) {
            console.error('Error en el canal de reenvío de puertos:', err);
            sshClient.end();
            return;
        }
        console.log("Forwarding establecido");

        //////////////////////////////////////////////////////////////////////////////////////////////////

        stream.write('00010sinitisess');
        // Recibir datos desde el túnel SSH
        stream.on('data', (data) => {
            if (data.toString() == '00012sinitOKisess') {
                console.log("Servicio Inicio de Sesion enlazado al bus");
            }
                console.log(data.toString())
                const x = data.toString();
                var datos = (x).slice(10);
                const splitdata = datos.split('|')
                const mail = splitdata[0]
                const pass = splitdata[1]
                stream.write('00010DBserisess'+"|"+ mail + "|" + pass);
                stream.on('data', (data) => {
                    console.log(data.toString())
                    const x = data.toString();
                    var datos = (x).slice(12);
                    datos = "existe";
                    if (datos == "existe") {
                        stream.write('00011isessexiste');
                    }
                    else{
                        stream.write('00010isessnoexiste');
                    }
                    });
            
        });


        //////////////////////////////////////////////////////////////////////////////////////////////////


        // Cerrar el túnel SSH y la conexión SSH cuando hayas terminado
        stream.on('close', () => {
          sshClient.end();
        });
    });
});

sshClient.on('error', (err) => {
  console.log('Error en la conexión SSH:', err);
  sshClient.end();
});

// Conectar al servidor SSH
sshClient.connect(sshConfig);