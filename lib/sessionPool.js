const mysql2 = require("mysql2/promise");
const { con, config } = require("./database");

const newDbSql = /*sql*/ `CREATE DATABASE IF NOT EXISTS session_store;`;
con.execute(newDbSql, (err, results, fields) => {
  console.log("Creating session_store database");
  if (err) {
    console.error(err.message);
  }
});

const options = {
  host: config.host,
  user: config.user,
  password: config.password,
  database: "session_store",
};

const sessionPool = mysql2.createPool(options);

module.exports = { sessionPool };
