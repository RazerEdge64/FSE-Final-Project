/**
 * This method is used for logging important information in the console (for now) can be extended to a database logger
 * in the future.
 * This is also a part of showcasing the singleton design pattern.
 */
class Logger {
    constructor() {
        this.logs = [];
    }

    log(message) {
        const logEntry = { timestamp: new Date(), message };
        this.logs.push(logEntry);

        // console.log(logEntry);
    }

    getLogs() {
        return this.logs;
    }
}

const loggerInstance = new Logger();

export default loggerInstance;
