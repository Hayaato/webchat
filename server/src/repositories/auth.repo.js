const pool = require("../database/db");

async function findByLogin(login){
    return await pool.query(
        "SELECT login, id, password FROM users WHERE login = $1",
        [login]
    );
}

async function createUser(login, hash){
    return pool.query(
        "INSERT INTO users (login, password) VALUES ($1, $2)",
        [login, hash]
    );
}

module.exports = {findByLogin, createUser}