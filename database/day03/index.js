import express from 'express';
import { checkAuth } from './src/middleware/checkAuth.js'
import logIpAddress from './src/middleware/logIP.js'
import {devMogan,tinyMogan,combinedMogan} from './src/middleware/logMogan.js'
import createError from 'http-errors';
import { errorMidleware } from './src/middleware/errorHandle.js';
import productRoute from './src/routes/productRoute.js'
const app = express();
const port = 3000;


// app.use(morgan)
app.use(express.json());
app.use(logIpAddress);
app.get('/test', checkAuth, (req, res) => {
    res.send(123);
})
app.use(combinedMogan);
app.use('/products',productRoute)
app.use((req, res, next) => {
    return next(createError(404, 'Not Found'));
})
app.use(errorMidleware);
app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
})
