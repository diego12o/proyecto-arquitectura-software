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
        //////////////////////////////////////////////////////////////////////////////////////////////////
        console.log("Forwarding establecido");
        stream.write('00010sinitusuar');
        stream.on('data', (data) => {
            if (data.toString() == '00012sinitOKusuar') {
                console.log("Servicio Usuario enlazado al bus");
            }
            else{
                console.log(data.toString())
                const x = data.toString();
                var datos = (x).slice(10);
                const splitdata = datos.split('|');
                const tipo = splitdata[0];


                if (tipo == "create") {
                    const rut = splitdata[1];
                    const mail = splitdata[2];
                    const password = splitdata[3];
                    const carrera = splitdata[4];
                    const nombre = splitdata[5];
                    const ano_ingreso = splitdata[6];
                    const tipo = splitdata[7];
                    console.log('00011DBsercreate'+"|"+rut+"|"+mail+"|"+password+"|"+carrera+"|"+nombre+"|"+ano_ingreso+"|"+tipo);
                    stream.write('00011DBsercreate'+"|"+rut+"|"+mail+"|"+password+"|"+carrera+"|"+nombre+"|"+ano_ingreso+"|"+tipo);
                    stream.on('data', (data) => {
                        console.log(data.toString());
                        const x = data.toString();
                        var datos = (x).slice(12);
                        
                        if (datos == "exito") {
                            stream.write("00015usuarexito")
                        }
                        else {
                            stream.write("00015usuarfracaso")
                        }
                    })
                }



                if (tipo == "update") {
                    const password = splitdata[1];
                    const mail = splitdata[2];
                    stream.write('00011DBserupdate'+"|"+password+"|"+mail);
                    stream.on('data', (data) => {
                        console.log(data.toString())
                        const x = data.toString();
                        var datos = (x).slice(12);
                        
                        if (datos == "actualizado") {
                            stream.write("00015usuaractualizado")
                        }
                        else {
                            stream.write("00015usuarnoactualizado")
                        }
                    })
                }


                if (tipo == "delete") {
                    const rut = splitdata[1];
                    const mail = splitdata[2];
                    const password = splitdata[3];
                    stream.write('00011DBserdelet'+"|"+password+"|"+mail+"|"+rut);
                    stream.on('data', (data) => {
                        console.log(data.toString())
                        const x = data.toString();
                        var datos = (x).slice(12);
                        
                        if (datos == "eliminado") {
                            stream.write("00015usuareliminado")
                        }
                        else {
                            stream.write("00015usuarnoeliminado")
                        }
                    })
                }
            }
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