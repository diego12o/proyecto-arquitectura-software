const pool = require("../config/database.js");

class UserRepository {
  constructor() {
    this.pool = pool;
  }

  async addUser(rut, mail, password, carrera, nombre, ano_ingreso, tipo) {
    try {
      await this.pool.query(
        "INSERT INTO usuarios(rut, mail, password, carrera, nombre, ano_ingreso, tipo) VALUES($1, $2, $3, $4, $5, $6, $7)",
        [rut, mail, password, carrera, nombre, ano_ingreso, tipo]
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async changePassword(password, mail) {
    try {
      await this.pool.query(
        'UPDATE "usuarios" SET password=$1 WHERE mail = $2',
        [password, mail]
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteUser(rut) {
    try {
      await this.pool.query("DELETE FROM usuarios WHERE Rut = $1", [rut]);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async findUserByMail(mail) {
    try {
      const result = await this.pool.query(
        "SELECT * FROM usuarios WHERE mail = $1",
        [mail]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

module.exports = UserRepository;
