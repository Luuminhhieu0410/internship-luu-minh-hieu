const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();


app.use(express.json());

const env = process.env.NODE_ENV || 'development';

const logError = async (err) => {
    const logMessage = `${new Date().toISOString()} - ${err.stack}\n`;
    try {
        await fs.appendFile(path.join(__dirname, 'error.log'), logMessage);
    } catch (logErr) {
        console.error('Không thể ghi log:', logErr);
    }
};
const errorHandler = (err, req, res, next) => {
    logError(err);

    const statusCode = err.statusCode || 500;
    const response = {
        error: {
            message: env === 'development' ? err.message : 'lỗi server'
        },
    };

    res.status(statusCode).json(response);
};
const notFoundHandler = (req, res, next) => {
    const err = new Error('Not Found');
    err.statusCode = 404;
    next(err);
};

app.get('/', (req, res) => {
    res.json({ message: 'test' });
});
// middleware 404
app.get('/error', (req, res, next) => {
    const err = new Error('lỗi gì đó rồi');
    err.statusCode = 500;
    next(err);
});
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(3000, () => {
    console.log('Server chạy trên cổng 3000');
});