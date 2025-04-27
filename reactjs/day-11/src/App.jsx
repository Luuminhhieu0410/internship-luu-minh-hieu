import { useState } from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import './App.css'

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    // kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      // nếu sản phẩm đã có, tăng quantity và cập nhật totalPrice
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                totalPrice: (item.quantity + 1) * item.price,
              }
            : item
        )
      );
    } else {
      // nếu sản phẩm chưa có, thêm mới với quantity = 1
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity: 1,
          totalPrice: product.price,
        },
      ]);
    }
  };

  return (
    <div>

      <ProductList addToCart={addToCart} />
      <Cart cartItems={cartItems} />
    </div>
  );
}

export default App;