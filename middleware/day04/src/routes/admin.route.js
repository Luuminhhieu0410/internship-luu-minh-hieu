import { Router } from "express";
import { addProduct, deleteProduct, getAllOrders, getAllUser, lockAcc, updateOrderStatus, updateProduct } from "../controllers/admin.controller.js";
import { authAdminMiddleware } from "../middleware/auth.middleware.js";
import { validateProduct } from "../middleware/validate.middleware.js";
let route = Router();
route.get('/users',authAdminMiddleware,getAllUser); // admin lấy toàn bộ thông tin users
route.patch('/users/:id/lock',authAdminMiddleware ,lockAcc); // admin khóa tài khoản users

route.post('/products',authAdminMiddleware,validateProduct,addProduct); // admin thêm product
route.put('/products/:id',authAdminMiddleware,updateProduct); // admin sửa thông tin của 1 product
route.delete('/products/:id',authAdminMiddleware,deleteProduct); // admin xóa 1 product

route.get('/orders',authAdminMiddleware,getAllOrders);// admin xem tất cả đơn
route.patch('/orders/:id/status',authAdminMiddleware,updateOrderStatus);  //cập nhật trạng thái đơn
export default route;

// GET /products
// POST /admin/products
// PUT /admin/products/:id
// DELETE /admin/products/:id
