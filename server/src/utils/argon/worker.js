const { parentPort } = require('worker_threads');
const argon2 = require('argon2');

const ARGON2_OPTIONS = {
    type: argon2.argon2id,
    timeCost: 1,
    memoryCost: 16000,
    parallelism: 1
};

parentPort.on('message', async (task) => {
    try {
        if (task.type === 'hash') {
            const hash = await argon2.hash(task.password, ARGON2_OPTIONS);
            parentPort.postMessage({ id: task.id, result: hash });
        }

        if (task.type === 'compare') {
            const result = await argon2.verify(task.hash, task.password);
            parentPort.postMessage({ id: task.id, result });
        }
    } catch (err) {
        parentPort.postMessage({ id: task.id, error: err.message });
    }
});