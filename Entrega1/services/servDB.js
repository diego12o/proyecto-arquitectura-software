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
        
        stream.write('00010sinitDBser');

        stream.on('data', (data) => {
          if (data.toString() == '00012sinitOKDBser') {
            console.log("Servicio enlazado al bus");
          }
          console.log(data.toString());
          const x = data.toString();
          var datos = (x).slice(10);
          const splitdata = datos.split('|')
          const tipo = splitdata[0]
          
          if (tipo == "create") {
              const rut = splitdata[1];
              const mail = splitdata[2];
              const password = splitdata[3];
              const carrera = splitdata[4];
              const nombre = splitdata[5];
              const ano_ingreso = splitdata[6];
              const tipo = splitdata[7];
              if (tipo == "0") {
                  tipo = 0;
              }
              if (tipo == "1") {
                tipo = 1;
              }
              const addUser = async (req, res) => {
                  try {
                      await pool.query('insert into usuarios(rut, mail, password, carrera, nombre, ano_ingreso, tipo)  values($1, $2, $3, $4, $5, $6, $7)'
                      , [rut, mail, password, carrera, nombre, ano_ingreso, tipo]);
                  } catch (error) {
                      console.log(error);
                  }
              }
              stream.write("00010DBserexito")
              //else{
              //  stream.write("00010DBserfracaso")
              //}
          }
          if (tipo == "update") {
            const password = splitdata[1];
            const mail = splitdata[2];
            const changePass = async (req, res) => {
              try {
                  await pool.query('update "usuarios" set password=$1, where mail = $2'
                      , [password,mail])
              } catch (error) {
                  console.log(error);
              }
            }
            stream.write("00011DBseractualizado")
          }

          if (tipo == "delete") {
            const password = splitdata[1];
            const mail = splitdata[2];
            const rut = splitdata[3];
            const deleteUser = async (req, res) => {
              try {
                  await pool.query(`
                  DELETE FROM usuarios
                  WHERE Rut = $1`, [rut]);
              } catch (error) {
                  console.log(error);
              }
            }
            stream.write("00011DBsereliminado")
          }

          if (tipo == "isess") {
            const mail = splitdata[1];
            const password = splitdata[2];
            const usuario = async (req, res) => {
              try {
                  await pool.query(` SELECT * FROM usuarios WHERE mail = $1`, [mail]);
              } catch (error) {
                  console.log(error);
              }
            }
            if (usuario.password == password) {
              stream.write("00011DBserexiste")
            }
            else{
              stream.write("00013DBsernoexiste")
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