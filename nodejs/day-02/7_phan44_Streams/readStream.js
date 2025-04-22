// Tạo Transform stream để thay thế chuỗi
const fs = require('fs');
const { Transform } = require('stream');

// Tạo Transform stream để thay thế chuỗi
const replaceTransform = new Transform({
    transform(chunk, encoding, callback) {
        const replaced = chunk.toString().replace(/ERROR/g, '⚠️ Warning');
        callback(null, replaced);
    }
});

// Tạo stream đọc và ghi
const readStream = fs.createReadStream(`${__dirname}/input1.txt`, { encoding: 'utf8', highWaterMark: 64 * 1024 }); // 64KB chunks
const writeStream = fs.createWriteStream(`${__dirname}/output1.txt`);

// Pipe: read -> transform -> write
readStream.pipe(replaceTransform).pipe(writeStream);

// Xử lý sự kiện khi hoàn tất
writeStream.on('finish', () => {
    console.log('File processed successfully!');
});

// Xử lý lỗi
readStream.on('error', (err) => console.error('Read error:', err));
replaceTransform.on('error', (err) => console.error('Transform error:', err));
writeStream.on('error', (err) => console.error('Write error:', err));
