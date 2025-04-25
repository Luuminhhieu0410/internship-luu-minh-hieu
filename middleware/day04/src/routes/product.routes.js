import { Router } from "express";
import { getAllProduct,filterProduct,searchByName } from "../controllers/product.controller.js";

let route = Router();

route.get('/:page',getAllProduct); // phân trang sản phẩm
route.get('/filter/:category',filterProduct); // lọc sản phẩm theo loại
route.get('/search/:name',searchByName); // tìm kiếm sản phẩm
export default route;
