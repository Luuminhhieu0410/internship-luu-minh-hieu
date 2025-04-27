import ProductItem from "./ProductItem";
import { products } from "../data/products"; // data products

const ProductList = ({ addToCart }) => {
  return (
    <div className="product-list">
      
      {products.map((product) => (
        <ProductItem key={product.id} product={product} addToCart={addToCart} />
      ))}
    </div>
  );
};

export default ProductList;