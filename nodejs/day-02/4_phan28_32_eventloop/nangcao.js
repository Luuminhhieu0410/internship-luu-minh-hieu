const iterations = parseInt(process.argv[2]) || 100;

let nextTickCount = 0;
let timeoutCount = 0;
let immediateCount = 0;

const executionOrder = [];
const startTime = performance.now();

// Hàm ghi lại thứ tự thực thi
function logExecution(type) {
    executionOrder.push(type);
}

// Tạo các tác vụ
for (let i = 0; i < iterations; i++) {
    process.nextTick(() => {
        logExecution('nextTick');
        nextTickCount++;
        checkCompletion();
    });

    setTimeout(() => {
        logExecution('setTimeout');
        timeoutCount++;
        checkCompletion();
    }, 0);

    setImmediate(() => {
        logExecution('setImmediate');
        immediateCount++;
        checkCompletion();
    });
}

// Kiểm tra xem tất cả tác vụ đã hoàn thành chưa
function checkCompletion() {
    if (nextTickCount === iterations && timeoutCount === iterations && immediateCount === iterations) {
        const endTime = performance.now();
        const totalTime = endTime - startTime;

        console.log(`Tổng thời gian thực thi: ${totalTime.toFixed(2)}ms`);
        console.log(`Số lần thực thi:`);
        console.log(`- process.nextTick: ${nextTickCount}`);
        console.log(`- setTimeout: ${timeoutCount}`);
        console.log(`- setImmediate: ${immediateCount}`);
         console.log(`Thứ tự thực thi (mẫu đầu tiên):`, executionOrder); // In 10 mục đầu tiên để tránh quá dài
    }
}