import jwt from "jsonwebtoken";
import { config } from 'dotenv'
config()
export async function authAdminMiddleware(req, res, next) {
    try {
        if (!req.header('Authorization')) return res.status(403).json({ message: "Chưa đăng nhập" });
        let token = req.header('Authorization').split(' ')[1];
        jwt.verify(token, process.env.SECRET, { algorithms: "HS256" }, (err, payload) => {
            if (err) return res.status(403).json({ message: "Token hết hạn hoặc không hợp lệ" });
            if (payload.role === 'user') return res.status(403).json({ message: "Bạn không có quyền admin" });
            req.user = payload;
            console.log(payload);
            next();
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export async function authUserMiddelware(req, res, next) {
    try {
        if (!req.header('Authorization')) return res.status(403).json({ message: "Chưa đăng nhập" });
        let token = req.header('Authorization').split(' ')[1];
        jwt.verify(token, process.env.SECRET, { algorithms: "HS256" }, (err, payload) => {
            if (err) return res.status(403).json({ message: "Token hết hạn hoặc không hợp lệ" });
            if (payload.role === 'admin') return res.status(403).json({ message: "Bạn không có quyền user" });
            req.user = payload;
            console.log(payload);
            next();
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}
