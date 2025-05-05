import CartItem from './CartItem';
import CartContext from '../context/CartContext';
import { useContext } from "react";

const Cart = () => {
  let { cartItems, setCartItems } = useContext(CartContext);
  const totalCartPrice = cartItems.reduce(
    (total, item) => total + Number(item.totalPrice),
    0
  );
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
                <th>Action</th>
              </tr> 
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  cartItem={item}
                  setCartItems={setCartItems}
                />
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="total-label">
                  Total:
                </td>
                <td>${totalCartPrice.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default Cart;