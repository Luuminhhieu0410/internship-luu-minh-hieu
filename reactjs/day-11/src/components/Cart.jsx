const Cart = ({ cartItems }) => {
  // Tính tổng tiền của toàn bộ giỏ hàng
  const totalCartPrice = cartItems.reduce((total, item) => total + item.totalPrice, 0);

  return (
    <div className="cart">
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Cart is empty</p>
      ) : (
        <div>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>{item.quantity}</td>
                  <td>${item.totalPrice}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="total-label">
                  Total:
                </td>
                <td>${totalCartPrice}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default Cart;