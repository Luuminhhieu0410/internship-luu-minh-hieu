import {Router} from 'express';
import { addProduct, deleteProduct, getAllProduct, updateProduct } from '../controllers/productController.js';
import { checkAuth } from '../middleware/checkAuth.js';
const router = Router();
router.get('/',checkAuth,getAllProduct);
router.post('/',checkAuth,addProduct);
router.put('/:id',checkAuth,updateProduct);
router.delete('/:id',checkAuth,deleteProduct)
export default router;