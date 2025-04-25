import { Router } from "express";
import { authRegister,authLogin } from "../controllers/auth.controller.js";
let route = Router();
route.post('/register',authRegister); // user đăng nhập 
route.post('/login',authLogin); // user đăng ký

export default route;