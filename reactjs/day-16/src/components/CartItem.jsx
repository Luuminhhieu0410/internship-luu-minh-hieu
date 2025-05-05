const CartItem = ({ cartItem, setCartItems }) => {
  const handleQuantityChange = (delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === cartItem.id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta),
              totalPrice: Number((item.price * Math.max(1, item.quantity + delta)).toFixed(2)),
            }
          : item
      )
    );
  };

  const handleRemove = () => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItem.id));
  };

  return (
    <tr>
      <td>{cartItem.title}</td>
      <td>${cartItem.price.toFixed(2)}</td>
      <td>
        <button onClick={() => handleQuantityChange(-1)}>-</button>
        <span style={{ margin: '0 10px' }}>{cartItem.quantity}</span>
        <button onClick={() => handleQuantityChange(1)}>+</button>
      </td>
      <td>${Number(cartItem.totalPrice).toFixed(2)}</td>
      <td>
        <button onClick={handleRemove} className="bg-red-500 text-white px-2 py-1 rounded">
          Remove
        </button>
      </td>
    </tr>
  );
};

export default CartItem;