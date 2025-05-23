const { Pool } = require("pg")

const pool = new Pool({
    host: "localhost",
    port: 5432,
    password: "System@2025",//root
    database: "postgres",
    user: "postgres",
    idleTimeoutMillis: 300
})


module.exports = pool