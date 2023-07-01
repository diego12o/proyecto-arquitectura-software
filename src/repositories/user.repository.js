const pool = require("../config/database.js");

class UserRepository {
  constructor() {
    this.pool = pool;
  }

  async addUser(
    rut,
    correo,
    contrasena,
    carrera,
    nombre,
    ano_ingreso,
    es_admin = false
  ) {
    try {
      await this.pool.query(
        "INSERT INTO usuario(rut, correo, contrasena, carrera, nombre, ano_ingreso, es_admin) VALUES($1, $2, $3, $4, $5, $6, $7)",
        [rut, correo, contrasena, carrera, nombre, ano_ingreso, es_admin]
      );
      const result = await this.pool.query(
        "SELECT * FROM usuario WHERE rut = $1",
        [rut]
      );
      return result.rows.length > 0 ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async changePassword(contrasena, correo) {
    try {
      const result = await this.pool.query(
        'UPDATE "usuario" SET contrasena=$1 WHERE correo = $2',
        [contrasena, correo]
      );
      return result.rowCount > 0 ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteUser(rut) {
    try {
      const result = await this.pool.query(
        "DELETE FROM usuario WHERE rut = $1",
        [rut]
      );
      return result.rowCount > 0 ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async findUserByMail(correo) {
    try {
      const result = await this.pool.query(
        "SELECT * FROM usuario WHERE correo = $1",
        [correo]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

module.exports = { UserRepository };
