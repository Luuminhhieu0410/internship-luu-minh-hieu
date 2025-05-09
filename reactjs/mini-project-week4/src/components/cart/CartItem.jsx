import useCart from '../../hooks/useCart';
import { Button, message, Popconfirm } from 'antd';

const CartItem = ({ cartItem }) => {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCart();

  return (
    <tr>
      <td>{cartItem.name}</td>
      <td>${cartItem.price.toFixed(2)}</td>
      <td>
        <button onClick={() => decreaseQuantity(cartItem.id)}>-</button>
        <span style={{ margin: '0 10px' }}>{cartItem.quantity}</span>
        <button onClick={() => increaseQuantity(cartItem.id)}>+</button>
      </td>
      <td>${Number(cartItem.totalPrice).toFixed(2)}</td>
      <td>
     <Popconfirm
  title="Xác nhận xóa"
  description="Bạn có chắc chắn muốn xóa sản phẩm này không?"
  onConfirm={() => removeItem(cartItem.id)}
  onCancel={() => message.info('Đã hủy xóa')}
  okText="Xóa"
  cancelText="Hủy"
>
  <Button danger>Xóa</Button>
</Popconfirm>
       
      </td>
    </tr>
  );
};


export default CartItem;