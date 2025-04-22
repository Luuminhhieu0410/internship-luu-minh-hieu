const { randomFillSync } = require('crypto');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const busboy = require('busboy');

const random = (() => {
  const buf = Buffer.alloc(16);
  return () => randomFillSync(buf).toString('hex');
})();

http.createServer((req, res) => {
  if (req.method === 'POST') {
    const bb = busboy({ headers: req.headers });
    bb.on('file', (name, file, info) => {
      const saveTo = path.join(os.tmpdir(), `busboy-upload-${random()}`);
      file.pipe(fs.createWriteStream(saveTo));
    });
    bb.on('close', () => {
      res.writeHead(200, { 'Connection': 'close' });
      res.end(`That's all folks!`);
    });
    req.pipe(bb);
    return;
  }
  res.writeHead(404);
  res.end();
}).listen(8000, () => {
  console.log('Listening for requests');
});