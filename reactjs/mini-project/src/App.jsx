import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import AddProductForm from "./components/AddProductForm";
import useCart from "./hooks/useCart";
import './App.css';
import {useState} from "react";

function App() {
  const { cartItems, addToCart, setCartItems } = useCart();
  const [products, setProducts] = useState([]);

  const handleAddProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  return (
    <div className="app-container">
      <ProductList products={products} setProducts={setProducts} onAddToCart={addToCart} />
      <Cart cartItems={cartItems} setCartItems={setCartItems} />
      <AddProductForm onAddProduct={handleAddProduct} />
      <div style={{ width: '100%', marginTop: '20px' }}>
        <button
          style={{ width: '100%', borderRadius: '5px', background: '#4CAF50', color: 'white', padding: '10px' }}
          onClick={() => console.log('Update cart clicked')}
        >
          Cập nhật giỏ hàng
        </button>
      </div>
    </div>
  );
}

export default App;