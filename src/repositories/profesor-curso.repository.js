const pool = require("../config/database.js");

class ProfesorCursoRepository {
  constructor() {
    this.pool = pool;
  }

  async addProfesorCurso(codigo_curso, id_profesor) {
    try {
      await this.pool.query(
        "INSERT INTO profesor_curso(codigo_curso, id_profesor) VALUES($1, $2)",
        [codigo_curso, id_profesor]
      );
      const result = await this.pool.query(
        "SELECT * FROM profesor_curso WHERE codigo_curso = $1 AND id_profesor = $2",
        [codigo_curso, id_profesor]
      );
      return result.rows.length > 0 ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteProfesorCurso(id) {
    try {
      const result = await this.pool.query(
        "DELETE FROM profesor_curso WHERE id = $1",
        [id]
      );
      return result.rowCount > 0 ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteAllByProfesorId(id_profesor) {
    try {
      const result = await this.pool.query(
        "DELETE FROM profesor_curso WHERE id_profesor = $1",
        [id_profesor]
      );
      return result.rowCount > 0 ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async findProfesorCursoById(id) {
    try {
      const result = await this.pool.query(
        "SELECT * FROM profesor_curso WHERE id = $1",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

module.exports = { ProfesorCursoRepository };
