#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = process.argv[2];

if (!filePath) {
  console.error('Vui lòng cung cấp đường dẫn file CSV.');
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error('File không tồn tại:', filePath);
  process.exit(1);
}

const rl = readline.createInterface({
  input: fs.createReadStream(filePath),
  crlfDelay: Infinity
});

let headers = [];
const sums = {};
const counts = {};

rl.on('line', (line) => {
  const columns = line.split(',');

  if (headers.length === 0) {
    headers = columns;
    headers.forEach((header) => {
      sums[header] = 0;
      counts[header] = 0;
    });
  } else {
    columns.forEach((value, index) => {
      const num = parseFloat(value.trim());
      if (!isNaN(num)) {
        const key = headers[index];
        sums[key] += num;
        counts[key] += 1;
      }
    });
  }
});

rl.on('close', () => {
  console.log('\nTóm tắt số liệu từ file:', filePath);
  console.log('================================================================');
  console.log(`${pad('Cột', 20)} | ${pad('Tổng', 15)} | ${pad('Trung bình', 15)}`);
  console.log('----------------------------------------------------------------');

  for (const key of headers) {
    if (counts[key] > 0) {
      const total = sums[key];
      const avg = total / counts[key];
      console.log(`${pad(key, 20)} | ${pad(total.toFixed(2), 15)} | ${pad(avg.toFixed(2), 15)}`);
    }
  }
  console.log('==============================================================');
});

function pad(str, length) { // hàm chỉ tạo kí tự khoảng trắng
  str = String(str);
  return str + ' '.repeat(Math.max(0, length - str.length));
}
