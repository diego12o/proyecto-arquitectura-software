const pool = require("../config/database.js");

class UserRepository {
  constructor() {
    this.pool = pool;
  }

  async addCourse(
    codigo,
    carrera,
    nombre
  ) {
    try {
      await this.pool.query(
        "INSERT INTO curso(codigo, carrera, nombre) VALUES($1, $2, $3)",
        [codigo, carrera, nombre]
      );
      const result = await this.pool.query(
        "SELECT * FROM curso WHERE codigo = $1",
        [codigo]
      );
      return result.rows.length > 0 ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async updateCourse(
    codigo,
    nombre
  ) {
    try {
      await this.pool.query(
        'UPDATE "curso" SET nombre=$1 WHERE codigo = $2',
        [ nombre, codigo]
      );
      const result = await this.pool.query(
        "SELECT * FROM curso WHERE codigo = $1",
        [codigo]
      );
      return result.rows.length > 0 ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteCourse(codigo) {
    try {
      const result = await this.pool.query(
        "DELETE FROM curso WHERE codigo = $1",
        [codigo]
      );
      return result.rowCount > 0 ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  
}

module.exports = { UserRepository };
