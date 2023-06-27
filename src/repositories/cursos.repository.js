const pool = require("../config/database.js");

class UserRepository {
  constructor() {
    this.pool = pool;
  }

  
}

module.exports = { UserRepository };
