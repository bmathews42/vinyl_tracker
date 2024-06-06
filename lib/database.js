const mysql = require("mysql2");
require("dotenv").config();

const config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
};

const con = mysql.createConnection(config);

con.connect((err) => {
  if (err) throw err;
});

module.exports = {
  con,
  config,
};
