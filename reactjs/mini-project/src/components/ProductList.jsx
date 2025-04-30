import { useEffect } from 'react';
import ProductItem from './ProductItem';

const ProductList = ({ products,setProducts, onAddToCart }) => {
  

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=8')
      .then((res) => res.json())
      .then((data) => {
        setProducts(
          data.products.map((product) => ({
            id: product.id,
            title: product.title,
            thumbnail: product.thumbnail,
            price: product.price,
          }))
        );
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="product-list">
      {products.length === 0 ? (
        Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="product-item loading-placeholder" />
        ))
      ) : (
        products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onAdd={() => onAddToCart(product)}
          />
        ))
      )}
    </div>
  );
};

export default ProductList;