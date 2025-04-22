const fs = require('fs');

// Tạo stream đọc và ghi
const readStream = fs.createReadStream(`${__dirname}/input.txt`, { encoding: 'utf8' });
const writeStream = fs.createWriteStream(`${__dirname}/output.txt`);

// Pipe dữ liệu từ readStream sang writeStream
readStream.pipe(writeStream);

// Xử lý sự kiện khi hoàn tất
writeStream.on('finish', () => {
    console.log('File copied successfully!');
});

readStream.on('error', (err) => console.error('Read error:', err));
writeStream.on('error', (err) => console.error('Write error:', err));