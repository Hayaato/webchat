const { parentPort } = require('worker_threads');
const bcrypt = require('bcrypt');

parentPort.on('message', async (task) => {
    try {
        if (task.type === 'hash') {
            const hash = await bcrypt.hash(task.password, 8);
            parentPort.postMessage({ id: task.id, result: hash });
        }

        if (task.type === 'compare') {
            const result = await bcrypt.compare(task.password, task.hash);
            parentPort.postMessage({ id: task.id, result });
        }
    } catch (err) {
        parentPort.postMessage({ id: task.id, error: err.message });
    }
});