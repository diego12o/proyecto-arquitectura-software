const Client = require('ssh2').Client;
const prompt = require("prompt-sync")({ sigint: true });
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



        console.log("Tunel SSH implementado exitosamente");
        const a = "Hola";
        const b = "Bienvenido a la plataforma de criticas UDP";
        const c = "¿Que desea hacer?";
        const d = "Opciones: ";
        const e = "1. Registrar usuario";
        const f = "2. Cambiar contraseña";
        const g = "3. Eliminar usuario";
        const h = "4. Iniciar Sesion";
        const i = "0. Salir de la aplicacion";
        console.log(a,'\n',b,'\n',c,'\n',d,'\n',e,'\n',f,'\n',g,'\n',h,'\n',i,'\n');
        const op = prompt("");
        if (op == 1) {
            console.log('\n');
            console.log("Registro de Usuario, por favor rellene los siguientes campos:", '\n');
            const rut = prompt("Ingrese su rut: ");
            const mail = prompt("Ingrese su correo: ");
            const password = prompt("Ingrese su contraseña: ");
            const carrera = prompt("Ingrese la carrera a la que pertenece: ");
            const nombre = prompt("Ingrese su nombre: ");
            const ano_ingreso = prompt("Ingrese su año de ingreso a la universidad: ");
            //const tipo = prompt("Ingrese su nombre: ");
            console.log('00011usuarcreate'+"|"+rut+"|"+mail+"|"+password+"|"+carrera+"|"+nombre+"|"+ano_ingreso+"|"+"1");
            stream.write('00011usuarcreate'+"|"+rut+"|"+mail+"|"+password+"|"+carrera+"|"+nombre+"|"+ano_ingreso+"|"+"1");
            stream.on('data', (data) => {
                console.log(data.toString());
                const x = data.toString();
                var datos = (x).slice(12);
                if (datos == "exito") {
                    console.log("Usuario creado");
                }
                else {
                    console.log("Fracaso al hacer el usuario");
                }
            })
        }

        if (op == 2) {
            console.log('\n');
            console.log("Actualizacion de Contraseña, por favor rellene los siguientes campos:", '\n');
            const mail = prompt("Ingrese su correo: ");
            const pass = prompt("Ingrese su contraseña: ");
            stream.write("00011usuarupdate"+"|"+pass+"|"+mail);
            stream.on('data', (data) => {
                const x = data.toString();
                var datos = (x).slice(12);
                
                if (datos == "actualizado") {
                    console.log("Contraseña actualizada");
                }
                else {
                    console.log("Contraseña NO actualizada");
                }
            })
        }

        if (op == 3) {
            console.log('\n');
            console.log("Eliminar Usuario, por favor rellene los siguientes campos:", '\n');
            const mail = prompt("Ingrese su correo: ");
            const pass = prompt("Ingrese su contraseña: ");
            const rut = prompt("Ingrese su rut: ");
            stream.write("00011usuardelete"+"|"+rut+"|"+mail+"|"+pass);   
            stream.on('data', (data) => {
                const x = data.toString();
                var datos = (x).slice(12);
                
                if (datos == "eliminado") {
                    console.log("Usuario Eliminado");
                }
                else {
                    console.log("Usuario NO eliminado");
                }
            })
        }

        if (op == 4) {
            console.log('\n');
            console.log("Inicio de Sesion, por favor rellene los siguientes campos: ", '\n');
            const mail = prompt("Ingrese su correo: ");
            const pass = prompt("Ingrese su contraseña: ");
            stream.write("0005isess"+mail+"|"+pass);
            console.log("Sesion iniciada");
            /*
            stream.on('data', (data) => {
                const x = data.toString();
                var datos = (x).slice(12);
                if (datos == "existe") {
                    console.log("Sesion iniciada");
                }
                else{
                    console.log("Error al iniciar sesion");
                }
            });
            */
        }
        // Recibir datos desde el túnel SSH
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


