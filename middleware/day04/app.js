import express from 'express';
import createError from 'http-errors';
import adminRoute from './src/routes/admin.route.js'
import authRoute from './src/routes/auth.routes.js'
import productRoute from './src/routes/product.routes.js'
import orderRoute from './src/routes/order.routes.js'
import { errorHandle } from './src/middleware/error.middleware.js';
import { devMorgan } from './src/middleware/logMorgan.js';
const app = express();
const port = 3000;


// app.use(morgan)
app.use(express.json());
app.use(devMorgan);
app.use('/admin',adminRoute);
app.use('/auth',authRoute);
app.use('/products',productRoute)
app.use('/orders',orderRoute)
app.use((req, res, next) => {
    return next(createError(404, 'Not Found'));
})

app.use(errorHandle)
app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
})
