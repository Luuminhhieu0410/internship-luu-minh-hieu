import db from '../db/config.js';

export async function getAllProduct() {
    try {
        let [allProduct] = await db.query('select * from products');
        // console.log(allProduct);
        return allProduct;
    } catch (error) {
        console.log(error);
        return error;
    }
}
export async function addProduct(name, price, description, stock) {
    try {
        const [data] = await db.query(`insert into products(name,price,description,stock) values ('${name}',${price},'${description}',${stock})`);
        // console.log(data);
        if (data.affectedRows > 0) {
            return true;
        }
        return false
    } catch (error) {
        console.log(error);
        return error;
    }
}
export async function updateProduct(id,name,description,price,stock) {
    const sql = `UPDATE products SET name = '${name}',description = '${description}',price = ${price},stock = ${stock} WHERE id = ${id}`;
    try {
        // console.log(sql);
        let [data] = await db.query(sql);
        // console.log(data);
        if (data.affectedRows > 0) {
            return true;
        }
        return false;
    } catch (err) {
        console.log(err);
        return err
    }
}
export async function deleteProduct(id) {
    const sql = `delete from products where id = ${id}`;
    try {
        // console.log(sql);
        let [data] = await db.query(sql);
        // console.log(data);
        if (data.affectedRows > 0) {
            return true;
        }
        return false;
    } catch (err) {
        console.log(err);
        return err
    }
}