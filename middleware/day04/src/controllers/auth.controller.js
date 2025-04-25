import db from "../config/db.js";
import { hashPassword ,comparePassword} from "../untils/hashPassword.js";
import { signToken } from "../untils/jwt.js";



export async function authRegister(req, res, next) {
    try {
        const { email, name, password } = req.body;
        if (!email || !name || !password)
            return res.status(400).json({ message: "Nhập đủ thông tin" });

        const [exists] = await db.query("SELECT email FROM users WHERE email = ?", [email]);
        if (exists.length > 0) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }
    
        const hashedPassword = await hashPassword(password);
        const [result] = await db.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        if (result.affectedRows > 0) {
            return res.status(201).json({ message: "Tạo tài khoản thành công" });
        }

        res.status(500).json({ message: "Lỗi không xác định" });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export async function authLogin(req, res, next) {
    try {
        const { email, password } = req.body;
        
        // console.log(JSON.stringify(req.body));
        if (!email || !password)
            return res.status(400).json({ message: "Nhập đủ thông tin" });

        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: "Tài khoản không tồn tại" });
        }

        const user = users[0];
        console.log(user)
        if (user.isLock == 1) {
            return res.status(403).json({ message: "Tài khoản đã bị khóa" });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Tài khoản mật khẩu không chính xác" });
        }
      
        const payload = { id: user.id, name: user.name, email: user.email , role : user.role};
        const token = await signToken(payload);
        res.status(200).json({
            message: "Đăng nhập thành công",
            token,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
}
