const pool = require("../config/database.js");

class EvaluacionRepository {
  constructor() {
    this.pool = pool;
  }

  async addEvaluacion(id_profesor_curso, comentario, nota, fecha) {
    try {
      await this.pool.query(
        "INSERT INTO evaluacion(id_profesor_curso, comentario, nota, fecha) VALUES($1, $2, $3, $4)",
        [id_profesor_curso, comentario, nota, fecha]
      );
      const result = await this.pool.query(
        "SELECT * FROM evaluacion WHERE id_profesor_curso = $1 AND comentario = $2 AND nota = $3 AND fecha = $4",
        [id_profesor_curso, comentario, nota, fecha]
      );
      return result.rows.length > 0 ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteEvaluacion(id) {
    try {
      const result = await this.pool.query(
        "DELETE FROM evaluacion WHERE id = $1",
        [id]
      );
      return result.rowCount > 0 ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async findEvaluacionById(id) {
    try {
      const result = await this.pool.query(
        "SELECT * FROM evaluacion WHERE id = $1",
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async deleteAllByProfesorId(id_profesor_curso) {
    try {
      const result = await this.pool.query(
        "DELETE FROM evaluacion WHERE id_profesor_curso = $1",
        [id_profesor_curso]
      );
      return result.rowCount > 0 ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

module.exports = { EvaluacionRepository };
