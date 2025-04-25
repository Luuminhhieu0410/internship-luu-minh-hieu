import db from "../config/db.js";

export async function addOrderItem(req, res, next) {
    const user = req.user;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
        return res.status(400).json({ message: "điền đầy đủ thông tin " });
    }

    try {
        // kiểm tra sản phẩm có tồn tại không
        const [productRows] = await db.execute(
            "SELECT price FROM products WHERE id = ?",
            [product_id]
        );

        if (productRows.length === 0) {
            return res.status(404).json({ message: "Product not found." });
        }

        const price = productRows[0].price;

        //  lấy giỏ hàng "pending" của user
        const [orders] = await db.execute(
            "SELECT * FROM orders WHERE user_id = ? AND status = 'pending' LIMIT 1",
            [user.id]
        );

        let orderId;

        if (orders.length === 0) {
            //nếu chưa có đơn hàng thì tạo mới order cho user
            const [orderResult] = await db.execute(
                "INSERT INTO orders (user_id, total_price, status, created_at) VALUES (?, ?, 'pending', NOW())",
                [user.id, 0]
            );
            orderId = orderResult.insertId;
        } else {
            orderId = orders[0].id;
        }

        // kiểm tra sản phẩm đã có trong giỏ chưa
        const [items] = await db.execute(
            "SELECT * FROM order_items WHERE order_id = ? AND product_id = ? LIMIT 1",
            [orderId, product_id]
        );

        // nếu có -> cập nhật số lượng
        if (items.length > 0) {
            await db.execute(
                "UPDATE order_items SET quantity = quantity + ? WHERE order_id = ? AND product_id = ?",
                [quantity, orderId, product_id]
            );
        } else {
        // nếu chưa có -> thêm mới
            await db.execute(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                [orderId, product_id, quantity, price]
            );
        }

        // Cập nhật lại tổng tiền của đơn hàng
        await db.execute(
            `UPDATE orders 
             SET total_price = (
                 SELECT IFNULL(SUM(quantity * price), 0)
                 FROM order_items
                 WHERE order_id = ?
             )
             WHERE id = ?`,
            [orderId, orderId]
        );

        return res.status(200).json({ message: "Thêm sản phẩm thành công", order_id: orderId });
    } catch (err) {
        next(err);
    }
}

// Lấy giỏ hàng hiện tại của user
export async function getOrder(req, res, next) {
    const user = req.user;

    try {
        const [orders] = await db.execute(
            "SELECT * FROM orders WHERE user_id = ? AND status = 'pending' LIMIT 1",
            [user.id]
        );

        if (orders.length === 0) {
            return res.status(200).json({ message: "Cart is empty", order: null, items: [] });
        }

        const order = orders[0];

        const [items] = await db.execute(
            `SELECT oi.id, oi.product_id, p.name, oi.quantity, oi.price
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [order.id]
        );

        res.status(200).json({
            order,
            items
        });
    } catch (err) {
        next(err);
    }
}
