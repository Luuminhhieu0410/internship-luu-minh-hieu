import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import useCart from "./hooks/useCart";
import { AllRoutes } from "./routes/index";
import CartContext from "./context/CartContext";
import "./App.css";



export default function App() {
  console.log('re-render App ');
  const { addToCart, cartItems, setCartItems } = useCart();
  const [products, setProducts] = useState([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, setCartItems, products, setProducts }}>
     <BrowserRouter>
     <AllRoutes />
     </BrowserRouter>
    </CartContext.Provider>
  );
}
