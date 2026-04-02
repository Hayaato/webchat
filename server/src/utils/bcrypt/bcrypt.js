const pool = require('./pool');

function hash(password) {
    return pool.runTask({
        type: 'hash',
        password
    });
}

function compare(password, hash) {
    return pool.runTask({
        type: 'compare',
        password,
        hash
    });
}

module.exports = { hash, compare };