const EventEmitter = require('events');
const fs = require('fs');

class MyEmitter extends EventEmitter {
    logEvent(eventName) {
        const logMessage = `[${new Date().toISOString()}] Event: ${eventName}\n`;
        fs.appendFileSync('events.log', logMessage);
        console.log(logMessage);
    }
}

const myEmitter = new MyEmitter();

myEmitter.on('customEvent', () => myEmitter.logEvent('customEvent'));
myEmitter.emit('customEvent');