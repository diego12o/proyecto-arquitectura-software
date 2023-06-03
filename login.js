const pool = require('./BBDD/database');
const pws = require('./auxController')
const moment = require('moment')
const jwt = require("jsonwebtoken");


const createToken = (iduser) => {
  let payload = {
    userId: iduser,
    createdAt: moment().unix(),
    expiresAt: moment().add(1, "day").unix(),
  };

  return jwt.sign(payload, "Tok3n-4uth");
};


const login = async (req, res) => {
  try {

    pool.query(`select  *
                    from usuario
                    where usuario.mail = $1
                    and usuario.password = $2`, [req.body.user, pws.enc(req.body.pass)]).then(result => {
      console.log(result.rows);
      if (result.rows[0] != undefined) { 
        if (result.rows[0].type == true) {//usuario admin
          res.status(201).json({
            success: 'Ok',
            token: createToken(result.rows),
            user: 0
          });
        }
        else {
          res.status(201).json({//usuario alumno
            success: 'Ok',
            token: createToken(result.rows),
            user: 1
          });
        }
      }else{
        res.status(401).json({//usuario no encontrado
          msg: "verifique las credenciales e intente nuevamente"
        });
      }

    }).catch(error => console.log(error));
  } catch (error) {
    console.log(error);
  }

}



module.exports = {
  login
}