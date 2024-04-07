const Pool = require("pg").Pool;
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "studentDb", // kendi db nize göre ayarlayın
    password: "",
    port: "5432"
});

module.exports = pool;