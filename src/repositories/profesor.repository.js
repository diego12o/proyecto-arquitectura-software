const pool = require("../config/database.js");

class ProfesorRepository {
  constructor() {
    this.pool = pool;
  }

  async addProfesor(correo, nombre) {
    try {
      await this.pool.query(
        "INSERT INTO profesor(correo, nombre) VALUES($1, $2)",
        [correo, nombre]
      );
      const result = await this.pool.query(
        "SELECT * FROM profesor WHERE correo = $1 AND nombre = $2",
        [correo, nombre]
      );
      return result.rows.length > 0 ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteProfesor(correo) {
    try {
      const result = await this.pool.query(
        "DELETE FROM profesor WHERE correo = $1",
        [correo]
      );
      return result.rowCount > 0 ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async findProfesorById(id) {
    try {
      const result = await this.pool.query(
        "SELECT * FROM profesor WHERE id = $1",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async findProfesorByEmail(correo) {
    try {
      const result = await this.pool.query(
        "SELECT * FROM profesor WHERE correo = $1",
        [correo]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

module.exports = { ProfesorRepository };
