import React from 'react';
import { useContext } from 'react';
import CartContext from '../context/CartContext';

const CartItem = ({ cartItem }) => {
  const { increaseQuantity, decreaseQuantity, removeItem } = useContext(CartContext);

  return (
    <tr>
      <td>{cartItem.title}</td>
      <td>${cartItem.price.toFixed(2)}</td>
      <td>
        <button onClick={() => decreaseQuantity(cartItem.id)}>-</button>
        <span style={{ margin: '0 10px' }}>{cartItem.quantity}</span>
        <button onClick={() => increaseQuantity(cartItem.id)}>+</button>
      </td>
      <td>${Number(cartItem.totalPrice).toFixed(2)}</td>
      <td>
        <button
          onClick={() => removeItem(cartItem.id)}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default CartItem;