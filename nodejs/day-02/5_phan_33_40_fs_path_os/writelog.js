const fs = require('fs').promises;
const path = require('path');

async function writeLog() {
  try {
    const timestamp = new Date().toISOString();
    const logMessage = `Hello at ${timestamp}\n`;
    const logPath = path.join(__dirname, 'log.txt');
    await fs.appendFile(logPath, logMessage);
    console.log('log file thành công');
  } catch (err) {
    console.error('Error writing log:', err);
  }
}

writeLog();