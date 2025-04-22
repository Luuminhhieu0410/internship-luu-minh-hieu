// sum.js
// console.log(process.argv);
const a = Number(process.argv[2]);
const b = Number(process.argv[3]);
// sum.js


if (isNaN(a) || isNaN(b)) {
  console.error('Vui lòng nhập 2 số hợp lệ');
  process.exit(1);
}


console.log(`Tổng: ${a + b}`);
// process.stdout.write('Thông báo bình thường\n');
// process.stderr.write('Thông báo lỗi \n');
