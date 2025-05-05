import { useState, useEffect } from 'react';

const useCart = () => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                totalPrice: Number(((item.quantity + 1) * item.price).toFixed(2)),
              }
            : item
        );  
      }
      return [
        ...prevItems,
        {
          ...product,
          quantity: 1,
          totalPrice: Number(product.price.toFixed(2)),
        },
      ];
    });
  };

  return { cartItems, addToCart, setCartItems };
};

export default useCart;