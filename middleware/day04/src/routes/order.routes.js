import { Router } from "express";
import { addOrderItem, getOrder } from "../controllers/order.controller.js";
import { authUserMiddelware } from "../middleware/auth.middleware.js";

let route = Router();
route.post('/',authUserMiddelware, addOrderItem); //  user thêm sản phẩm vào giỏ hàng 
route.get('/',authUserMiddelware,getOrder); // user xem đơn hàng

export default route;