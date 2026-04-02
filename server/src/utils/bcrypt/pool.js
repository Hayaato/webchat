const { Worker } = require('worker_threads');
const os = require('os');
const path = require('path');

const WORKER_PATH = path.resolve(__dirname, './worker.js');
const THREADS = os.cpus().length;

class WorkerPool {
    constructor() {
        this.workers = [];
        this.queue = [];
        this.callbacks = new Map();
        this.id = 0;

        for (let i = 0; i < THREADS; i++) {
            this.createWorker();
        }
    }

    createWorker() {
        const worker = new Worker(WORKER_PATH);
        worker.busy = false;

        worker.on('message', (msg) => {
            const { id, result, error } = msg;
            const cb = this.callbacks.get(id);

            if (cb) {
                error ? cb.reject(error) : cb.resolve(result);
                this.callbacks.delete(id);
            }

            worker.busy = false;
            this.next();
        });

        worker.on('error', (err) => {
            console.error('Worker error:', err);
        });

        this.workers.push(worker);
    }

    runTask(task) {
        return new Promise((resolve, reject) => {
            const id = this.id++;

            this.callbacks.set(id, { resolve, reject });
            this.queue.push({ ...task, id });

            this.next();
        });
    }

    next() {
        const worker = this.workers.find(w => !w.busy);
        if (!worker || this.queue.length === 0) return;

        const task = this.queue.shift();
        worker.busy = true;
        worker.postMessage(task);
    }
}

module.exports = new WorkerPool();