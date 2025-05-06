import { useEffect ,useContext } from 'react';
import ProductItem from './ProductItem';
import CartContext from '../context/CartContext';
const ProductList = () => {
  const {addToCart ,products,setProducts} = useContext(CartContext);

  useEffect(() => {
    fetch('http://localhost:3000/products/1')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProducts(
          data.map((product) => ({
            id: product.id,
            title: product.name,
            thumbnail: product.thumbnail|| 'https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp',
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