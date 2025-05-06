import { useReducer, useEffect } from 'react';

const initialState = {
  cartItems: (() => {
    try {
      const savedCart = localStorage.getItem('cart');
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
      console.error('Lỗi ', error);
      return [];
    }
  })(),
};

const cartReducer = (state, action) => {
  
  switch (action.type) {
    case 'ADD_TO_CART':{
      const existingItem = state.cartItems.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.id === action.payload.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  totalPrice: Number(((item.quantity + 1) * item.price).toFixed(2)),
                }
              : item
          ),
        };
      }
      return {
        ...state,
        cartItems: [
          ...state.cartItems,
          {
            ...action.payload,
            quantity: 1,
            totalPrice: Number(action.payload.price.toFixed(2)),
          },
        ],
      };
    }
    case 'INCREASE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload
            ? {
                ...item,
                quantity: item.quantity + 1,
                totalPrice: Number(((item.quantity + 1) * item.price).toFixed(2)),
              }
            : item
        ),
      };
    case 'DECREASE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload
            ? {
                ...item,
                quantity: Math.max(1, item.quantity - 1),
                totalPrice: Number((item.price * Math.max(1, item.quantity - 1)).toFixed(2)),
              }
            : item
        ),
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
      };
    case 'SET_CART_ITEMS':{
      const newItems = Array.isArray(action.payload) ? action.payload : [];
      console.log('SET_CART_ITEMS payload:', action.payload, 'new cartItems:', newItems);
      return {
        ...state,
        cartItems: newItems,
      };
    }
    default:
      console.warn('Hành động không xác định:', action.type);
      return state;
  }
};

const useCart = () => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    } catch (error) {
      console.error('Lỗi khi lưu giỏ hàng vào localStorage:', error);
    }
  }, [state.cartItems]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const increaseQuantity = (itemId) => {
    dispatch({ type: 'INCREASE_QUANTITY', payload: itemId });
  };

  const decreaseQuantity = (itemId) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: itemId });
  };

  const removeItem = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const setCartItems = (items) => {
    dispatch({ type: 'SET_CART_ITEMS', payload: items });
  };

  return {
    cartItems: state.cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    setCartItems,
  };
};

export default useCart;