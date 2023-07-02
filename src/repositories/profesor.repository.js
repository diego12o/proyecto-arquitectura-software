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

  async updateProfesor(id, correo, nombre) {
    let result;
    try {
      result = await this.pool.query(
        "UPDATE profesor SET correo=$1, nombre =$2 WHERE id = $3",
        [correo, nombre, id]
      );
      return result.rowCount > 0 ? true : false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteProfesor(correo) {
    try {
      const row = await this.pool.query(
        "SELECT id FROM profesor WHERE correo = $1",
        [correo]
      );

      console.log({ row });
      console.log({ profe: row.rows[0] });
      const id_profesor = row.rows[0]?.id;
      if (!id_profesor) return false;

      await this.pool.query(
        "DELETE FROM evaluacion WHERE id_profesor_curso IN (SELECT id FROM profesor_curso WHERE id_profesor = $1)",
        [id_profesor]
      );

      await this.pool.query("DELETE FROM profesor_curso WHERE id_profe = $1", [
        id_profesor,
      ]);

      const result = await this.pool.query(
        "DELETE FROM profesor WHERE correo = $1",
        [correo]
      );

      return result.rowCount > 0;
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
