function generateId() {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0].toString(16);
}
module.exports = {generateId};