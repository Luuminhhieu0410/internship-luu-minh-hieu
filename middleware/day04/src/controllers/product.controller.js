import db from "../config/db.js";

export async function getAllProduct(req, res, next) {
    try {
        if (!req.params.page) return;
        let offset = (req.params.page - 1) * 10;
        // console.log(offset);

        let [allProduct] = await db.query(`select * from products limit 10 offset ${offset}`);
        return res.status(200).json(allProduct);
    } catch (error) {
        console.log(error);
        next(error);
    }
}
export async function searchByName(req, res, next) {
    try {
        let name = req.params.name;
        let [searchProduct] = await db.query(`select * from products where name like '%${name}%'`);
        return res.status(200).json(searchProduct);
    } catch (error) {
        console.log(error);
        next(error);
    }
}
export async function filterProduct(req, res, next) {
    try {
        let category = req.params.category;
        let [productByCategory] = await db.query(`select * from products where category like '%${category}%'`);
        return res.status(200).json(productByCategory);
    } catch (error) {
        console.log(error);
        next(error);
    }
}