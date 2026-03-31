const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 50,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.query('SELECT 1')
    .then(() => console.log("[DB] Connected successfully"))
    .catch(err => console.error("[DB] Connection error:", err.message));

module.exports = pool;
