const fs = require('fs').promises;
const path = require('path');
const zlib = require('zlib');

const { promisify } = require('util');
const { createWriteStream, createReadStream } = require('fs');
const { pipeline } = require('stream').promises;
const archiver = require('archiver');

// Promisify zlib functions
const gzip = promisify(zlib.gzip);

async function logArchiver() {
  try {
    // Định nghĩa thư mục logs và archives
    const logsDir = path.join(__dirname, 'logs');
    const archivesDir = path.join(__dirname, 'archives');

    // Tạo thư mục archives nếu chưa tồn tại
    await fs.mkdir(archivesDir, { recursive: true });

    // Đọc tất cả file trong thư mục logs
    const files = await fs.readdir(logsDir);
    const logFiles = files.filter((file) => path.extname(file).toLowerCase() === '.log');

    if (logFiles.length === 0) {
      console.log('No .log files found in /logs');
      return;
    }

    // Tạo timestamp cho tên file zip
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 12); // YYYYMMDD_HHMM
    const zipPath = path.join(archivesDir, `logs_${timestamp}.zip`);

    // Khởi tạo archiver
    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    // Xử lý lỗi và hoàn thành
    output.on('close', () => console.log(`Archive created: ${zipPath}, ${archive.pointer()} bytes`));
    archive.on('error', (err) => {
      throw err;
    });
    
    // Kết nối archiver với output stream
    archive.pipe(output);

    // Đổi tên và thêm file vào archive
    for (const file of logFiles) {
      const oldPath = path.join(logsDir, file);
      const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 12); // YYYYMMDD_HHMM
      const newFileName = `log_${timestamp}.log`;
      const newPath = path.join(logsDir, newFileName);

      // Đổi tên file
      await fs.rename(oldPath, newPath);

      // Thêm file vào archive
      archive.file(newPath, { name: newFileName });
      console.log(`Renamed and added to archive: ${newFileName}`);
    }

    // Hoàn thành archive
    await archive.finalize();
  } catch (err) {
    console.error('Error in log archiver:', err);
  }
}

logArchiver();