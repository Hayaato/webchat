

function password(generic) {
    return Math.random().toString(36).slice(2, 2 + generic);
}
module.exports = {password};