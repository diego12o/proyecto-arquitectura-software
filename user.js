const pool = require('./BBDD/database');


const deleteUser = async (req, res) => {
    try {
        await pool.query(`
          DELETE FROM usuarios
          WHERE Rut = $1`, [req.body.rut]);

    } catch (error) {
        console.log(error);
    }

}

const changePass = async (req, res) => {
    try {
        await pool.query('update "usuarios" set password=$1, where mail = $2'
            , [req.body.password, req.body.mail])
    } catch (error) {
        console.log(error);
    }

}

const addUser = async (req, res) => {
    try {
        await pool.query('insert into usuarios(rut, mail, password, carrera, nombre, ano_ingreso, tipo)  values($1, $2, $3, $4, $5, $6, $7) '
        , [req.body.rut, req.body.mail, req.body.password, req.body.carrera, req.body.nombre, req.body.ano_ingreso, 1]);
    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    deleteUser,
    changePass,
    addUser
}