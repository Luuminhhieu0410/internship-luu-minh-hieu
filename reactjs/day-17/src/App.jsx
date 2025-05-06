import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import useCart from "./hooks/useCart";
import { AllRoutes } from "./routes/index";
import CartContext from "./context/CartContext";
import "./App.css";



export default function App() {
  console.log('re-render App ');
  const { addToCart, cartItems, setCartItems , increaseQuantity,decreaseQuantity,removeItem} = useCart();
  const [products, setProducts] = useState([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, setCartItems, products, setProducts , increaseQuantity, decreaseQuantity, removeItem,}}>
     <BrowserRouter>
     <AllRoutes />
     </BrowserRouter>
    </CartContext.Provider>
  );
}
