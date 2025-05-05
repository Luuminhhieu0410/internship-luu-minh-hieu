import { useEffect ,useContext } from 'react';
import ProductItem from './ProductItem';
import CartContext from '../context/CartContext';
const ProductList = () => {
  const {addToCart ,products,setProducts} = useContext(CartContext);

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
            description : product.description
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
            onAdd={() => addToCart(product)}
          />
        ))
      )}
    </div>
  );
};

export default ProductList;