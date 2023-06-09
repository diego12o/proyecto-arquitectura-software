const pool = require("../config/database.js");

class EvaluationRepository {
  constructor() {
    this.pool = pool;
  }

  async addEvaluation(id_profesor_curso, comentario, nota, fecha, rut_usuario) {
    try {
      await this.pool.query(
        "INSERT INTO evaluacion(id_profesor_curso, comentario, nota, fecha, rut_usuario) VALUES($1, $2, $3, $4, $5)",
        [id_profesor_curso, comentario, nota, fecha, rut_usuario]
      );

      const result = await this.pool.query(
        "SELECT * FROM evaluacion WHERE id_profesor_curso=$1 AND comentario=$2 AND nota=$3 AND fecha=$4 AND rut_usuario = $5",
        [id_profesor_curso, comentario, nota, fecha, rut_usuario]
      );
      return result.rows.length > 0 ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async seeAvg(id_profesor_curso) {
    try {
      const avg = await this.pool.query(
        "SELECT AVG(nota) FROM evaluacion WHERE id_profesor_curso = $1",
        [id_profesor_curso]
      );

      console.log(avg.rows[0]);
      return avg.rows[0];
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async seeEvaluation(rut) {
    try {
      const result = await this.pool.query(
        "SELECT * FROM evaluacion WHERE rut_usuario = $1",
        [rut]
      );
      console.log(result.rows);
      //return result.rows;
      return result.rows.length > 0 ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async seeComments(rut) {
    try {
      const result = await this.pool.query(
        "SELECT comentario, fecha, id FROM evaluacion WHERE rut_usuario = $1",
        [rut]
      );
      console.log(result.rows);
      return result.rows;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async updateComment(rut_alumno, fecha, nuevo_comentario) {
    try {
      await this.pool.query(
        "UPDATE evaluacion SET comentario=$1 WHERE rut_alumno=$2 AND fecha=$3",
        [nuevo_comentario, rut_alumno, fecha]
      );

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async editEvaluation(nota, comentario, id_profesor_curso, rut_alumno) {
    try {
      await this.pool.query(
        "UPDATE evaluacion SET nota=$1, comentario=$2 WHERE rut_alumno = $3 AND id_profesor_curso = $4",
        [nota, comentario, rut_alumno, id_profesor_curso]
      );

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteEvaluation(id_evaluation) {
    try {
      await this.pool.query("DELETE FROM evaluacion WHERE id = $1", [
        id_evaluation,
      ]);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteEvaluationAdmin(id_evaluation, rut_alumno) {
    try {
      const check = await this.pool.query(
        "SELECT * FROM usuario WHERE rut = $1 AND es_admin = true",
        [rut_alumno]
      );

      if (check.rows.length == 0) return false;

      await this.pool.query("DELETE FROM evaluacion WHERE id = $1", [
        id_evaluation,
      ]);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteAllByProfesorId(id_profesor) {
    let id;
    try {
      id = await this.pool.query(
        "SELECT id FROM profesor_curso WHERE id_profesor = $1",
        [id_profesor]
      );
    } catch (error) {
      console.error(error);
    }

    const id_profesor_curso = id.rows[0].id;

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

module.exports = { EvaluationRepository };

// TESTS

// const userRepository = new UserRepository();
// userRepository.addEvaluation('CIT1000', 2, 'Hola hola', 7, '25-06-2023', 198398594)
// userRepository.seeAvg('CIT1000', 1);
// userRepository.seeEvaluation(198398594);
// userRepository.seeComments(198398594);
// userRepository.editEvaluation(5, 'ADIOS-------', 1, 'CIT1000', 198398594);
// userRepository.deleteEvaluation(17, 198398594);
// userRepository.deleteEvaluationAdmin(19, 198398595);
