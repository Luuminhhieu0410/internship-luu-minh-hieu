import createHttpError from "http-errors";
import { getAllProduct as _getAllProduct, addProduct as _addProduct ,updateProduct as _updateProduct, deleteProduct as _deleteProduct } from "../models/product.js";

export async function getAllProduct(req, res, next) {
    try {
        let allProduct = await _getAllProduct();
        res.json(allProduct);
    } catch (error) {
        next(error);
    }
}
export async function addProduct(req, res, next) {
    try {
        if (!req.body) return next(createHttpError(500, 'Thiếu thông tin'));

        let { name, description, price, stock } = req.body;
        if(!name || !description || !price || !stock) return res.send('thiếu data');
        // console.log(JSON.stringify(req.body));
        let condition = await _addProduct(name, price, description, stock);
        if (condition) return res.status(201).json({
            message: 'thêm thành công',
            data: req.body
        })
    } catch (error) {
        next(error);
    }
}
export async function updateProduct(req, res, next) {
    try {
        const id = req.params.id;
        let { name, description, price, stock } = req.body;
        if(!name || !description || !price || !stock) return res.send('thiếu data');
         console.log(JSON.stringify(req.body));
        let condition = await _updateProduct(id,name,description,price,stock);
        if(condition) return res.status(201).json({
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
        let condition = await _deleteProduct(id);
        if(condition) return res.status(201).json({
            message: "xóa thành công"
        })
    } catch (error) {
        next(error);
    }
}
