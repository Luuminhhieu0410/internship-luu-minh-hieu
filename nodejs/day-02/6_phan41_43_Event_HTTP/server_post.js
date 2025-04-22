const http = require('http');
const fs = require('fs');
const EventEmitter = require('events');
const busboy = require('busboy');

class UploadEmitter extends EventEmitter {}
const uploadEmitter = new UploadEmitter();

// Hàm ghi log vào uploads.log
function logUpload(filename) {
    const logMessage = `[${new Date().toISOString()}] Uploaded file: ${filename}\n`;
    fs.appendFileSync(`${__dirname}/uploads.log`, logMessage);
    console.log(logMessage);
}

// Xử lý sự kiện upload:done
uploadEmitter.on('upload:done', (filename) => {
    logUpload(filename);
});

const server = http.createServer((req, res) => {
    if (req.url === '/upload' && req.method === 'POST') {
        const bb = busboy({ headers: req.headers });
        let fileName = '';

        // Xử lý khi nhận được file
        bb.on('file', (fieldname, file, filename) => {
          // console.log('file ' + JSON.stringify(file));
          // console.log('filename ' + JSON.stringify(filename));
          
            const saveTo = `${__dirname}/uploads/${filename.filename}`;
            file.pipe(fs.createWriteStream(saveTo));
        });

        // Khi hoàn tất upload
        bb.on('finish', () => {
            uploadEmitter.emit('upload:done', fileName);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'File uploaded successfully', filename: fileName }));
        });

        // Pipe request vào busboy
        req.pipe(bb);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Tạo thư mục uploads nếu chưa tồn tại
if (!fs.existsSync(`${__dirname}/uploads`)) {
    fs.mkdirSync(`${__dirname}/uploads`);
}

server.listen(3000, () => console.log('Server running on port 3000'));