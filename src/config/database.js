const Pool = require("pg").Pool;

const pool = new Pool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "arquisoft",
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    //console.log(result.rows)
    console.log("Database Connected");
  });
});

module.exports = pool;
