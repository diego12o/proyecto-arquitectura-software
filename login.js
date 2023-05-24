const bcrypt = require('bcrypt');


// Función para verificar la contraseña
function verifyPass(password, HashedPass) {
  return bcrypt.compareSync(password, HashedPass);
}

// Función para iniciar sesión
function iniciarSesion(usuario, password) {
  const HashedPass = getHashedPass(usuario);


  if (HashedPass && verifyPass(password, HashedPass)) {
    console.log('Inicio de sesión exitoso');
  } else {
    console.log('Usuario o contraseña incorrectos');
  }
}

const usuario = 'ejemplo@dominio.com';
const password = 'contraseña123';

iniciarSesion(usuario, password);