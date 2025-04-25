import db from "../config/db.js";

export async function getAllUser(req, res, next) {
    try {
        let [allUser] = await db.query("select * from users where role = 'user'");
        return res.status(201).json(allUser);
    } catch (error) {
        console.log(error);
        next(error);
    }
}
export async function lockAcc(req, res, next) {
    try {
        let id = req.params.id;
        if (!id) return res.status(500).json({ message: 'thiếu id user' });
        let [data] = await db.query(`select isLock from users where id = ${id}`);
        if (data.length == 0) return res.status(500).json({ message: 'user không tồn tại' })
        // console.log('isLock ' + JSON.stringify(data));
        if (data[0].isLock === '0') {// khóa tài khoản
            await db.query(`update users set isLock = '1' where id = ${id} `);
            return res.status(200).json({ message: 'khóa tài khoản thành công' });
        }
        await db.query(`update users set isLock = '0' where id = ${id} `) // mở tài khoản
        return res.status(200).json({ message: 'mở tài khoản thành công' });

    } catch (error) {
        console.log(error);
        next(error);
    }

}

export async function addProduct(req, res, next) {
    try {
        let { name, price, stock, description, category } = req.body;
        // console.log(JSON.stringify(req.body));
        let [insertData] = await db.query(`insert into products(name,price,stock,description,category) values ('${name}',${price},${stock},'${description}','${category}')`); 4
        // console.log(JSON.stringify(insertData));
        if (insertData.affectedRows > 0)
            return res.status(201).json({ message: 'thêm product thành công' })
    } catch (error) {
        console.log(error);
        next(error);
    }
}
export async function updateProduct(req, res, next) {
    try {
        const id = req.params.id;
        if(!id) return res.status(500).json({
            message:'thiếu id product'
        })
        let { name, description, price, stock } = req.body;
        if(!name || !description || !price || !stock) return res.send('thiếu data');
         console.log(JSON.stringify(req.body));
        let [updateData] = await db.query(`UPDATE products SET name = '${name}',description = '${description}',price = ${price},stock = ${stock} WHERE id = ${id}`)
        if(updateData.affectedRows > 0) return res.status(201).json({
            message: "sửa thành công"
        })
    } catch (error) {
        next(error);
    }
}
export async function deleteProduct(req, res, next) {
    try {
        let id = req.params.id;
        if(!id) return res.status(500).json({
            message:'thiếu id product'
        })
        let [deleteData] = await db.query(`delete from products where id = ${id}`);
        if(deleteData.affectedRows > 0) return res.status(201).json({
            message: "xóa thành công"
        })
    } catch (error) {
        next(error);
    }
}

export async function getAllOrders(req, res, next) {
    try {
        const [orders] = await db.execute(`
            SELECT 
                o.id AS order_id,
                o.user_id,
                u.email,
                o.total_price,
                o.status,
                o.created_at,
                COUNT(oi.id) AS total_items
            FROM orders o
            JOIN users u ON o.user_id = u.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `);

        res.status(200).json({ orders });
    } catch (err) {
        next(err);
    }
}

export async function updateOrderStatus(req, res, next) {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const allowedStatus = ['pending', 'paid', 'shipped', 'cancelled'];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        const [result] = await db.execute(
            `UPDATE orders SET status = ? WHERE id = ?`,
            [status, orderId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, message: "Đơn hàng cập nhật trạng thái thành công" });
    } catch (err) {
        next(err);
    }
}
