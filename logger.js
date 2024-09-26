'use strict';
class Logger {
    static log(path, ...message) {
        console.log(path.join('/'), '>', ...message)
    }

    static error(path, ...message) {
        console.error(path.join('/'), '>', ...message)
    }
}

module.exports = { Logger }