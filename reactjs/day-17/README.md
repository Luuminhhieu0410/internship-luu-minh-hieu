# Day 17: useReducer + Custom Hook
Nội dung chính
* Phân biệt useReducer vs useState
* Refactor Context dùng useReducer
* Tạo Custom Hook useCart()
* Call API NodeJS của chính mình ( 2 tuần trước )
* Xử lý loading, error, validate form
## Giải thích lý thuyết
Trong React, **`useState`** và **`useReducer`** đều được sử dụng để quản lý trạng thái (state) trong các functional component, nhưng chúng có mục đích và cách sử dụng khác nhau. Dưới đây là sự phân biệt giữa hai hooks này:

---

### 1. **`useState`**
- **Mô tả**: Là hook cơ bản để quản lý trạng thái đơn giản trong component. Nó trả về một cặp giá trị: trạng thái hiện tại và một hàm để cập nhật trạng thái.
- **Cú pháp**:
  ```javascript
  const [state, setState] = useState(initialState);
  ```
- **Khi nào sử dụng**:
  - Trạng thái đơn giản, độc lập (ví dụ: một giá trị số, chuỗi, boolean, hoặc một object/array nhỏ).
  - Logic cập nhật trạng thái không quá phức tạp.
  - Phù hợp với các component có ít trạng thái hoặc các trạng thái không phụ thuộc lẫn nhau.
- **Ví dụ**:
  ```javascript
  import React, { useState } from 'react';

  function Counter() {
    const [count, setCount] = useState(0);

    return (
      <div>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>
    );
  }
  ```
- **Ưu điểm**:
  - Dễ sử dụng, cú pháp ngắn gọn.
  - Phù hợp cho các trường hợp trạng thái đơn giản.
- **Nhược điểm**:
  - Khi trạng thái phức tạp hoặc có nhiều logic cập nhật, code có thể trở nên khó đọc và khó bảo trì.

---

### 2. **`useReducer`**
- **Mô tả**: Là hook mạnh mẽ hơn để quản lý trạng thái, đặc biệt khi trạng thái phức tạp hoặc có nhiều hành động (actions) ảnh hưởng đến trạng thái. Nó sử dụng một **reducer function** để xác định cách trạng thái thay đổi dựa trên hành động.
- **Cú pháp**:
  ```javascript
  const [state, dispatch] = useReducer(reducer, initialState);
  ```
  - `reducer`: Hàm nhận vào trạng thái hiện tại (`state`) và hành động (`action`), trả về trạng thái mới.
  - `dispatch`: Hàm để gửi hành động tới reducer.
- **Khi nào sử dụng**:
  - Trạng thái phức tạp (ví dụ: object lớn với nhiều thuộc tính hoặc trạng thái phụ thuộc lẫn nhau).
  - Có nhiều hành động khác nhau ảnh hưởng đến trạng thái (ví dụ: thêm, xóa, cập nhật).
  - Logic cập nhật trạng thái phức tạp hoặc cần tái sử dụng logic.
  - Muốn tổ chức code theo cách dễ kiểm tra và bảo trì hơn.
- **Ví dụ**:
  ```javascript
  import React, { useReducer } from 'react';

  const initialState = { count: 0 };

  function reducer(state, action) {
    switch (action.type) {
      case 'increment':
        return { count: state.count + 1 };
      case 'decrement':
        return { count: state.count - 1 };
      default:
        return state;
    }
  }

  function Counter() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
      <div>
        <p>Count: {state.count}</p>
        <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
        <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
      </div>
    );
  }
  ```
- **Ưu điểm**:
  - Tổ chức logic quản lý trạng thái tập trung trong reducer, dễ kiểm tra và bảo trì.
  - Phù hợp với trạng thái phức tạp hoặc các component có nhiều hành động.
  - Dễ dàng tái sử dụng reducer logic ở nhiều component.
- **Nhược điểm**:
  - Cú pháp phức tạp hơn so với `useState`.
  - Có thể quá mức cần thiết cho các trạng thái đơn giản.

---

### **So sánh nhanh**
| Tiêu chí              | `useState`                              | `useReducer`                           |
|-----------------------|-----------------------------------------|----------------------------------------|
| **Độ phức tạp**       | Đơn giản, dễ dùng                      | Phức tạp hơn, cần viết reducer         |
| **Trường hợp sử dụng**| Trạng thái đơn giản, ít logic          | Trạng thái phức tạp, nhiều hành động   |
| **Cú pháp**           | Ngắn gọn                               | Dài hơn, cần định nghĩa reducer        |
| **Tái sử dụng logic** | Khó tái sử dụng logic cập nhật         | Dễ tái sử dụng reducer ở nhiều nơi     |
| **Kiểm tra (testing)**| Ít hỗ trợ kiểm tra logic phức tạp      | Dễ kiểm tra do logic tập trung         |

---

### **Khi nào chọn cái nào?**
- **Dùng `useState`**:
  - Trạng thái là một giá trị đơn giản (số, chuỗi, boolean).
  - Logic cập nhật trạng thái không phức tạp.
  - Component nhỏ, không cần tái sử dụng logic trạng thái.
- **Dùng `useReducer`**:
  - Trạng thái là một object/array lớn với nhiều thuộc tính.
  - Có nhiều hành động khác nhau ảnh hưởng đến trạng thái.
  - Cần tổ chức code rõ ràng, dễ kiểm tra, hoặc tái sử dụng logic.
  - Muốn mô phỏng cách hoạt động của Redux trong một component.

---

### **Kết luận**
- **`useState`** là lựa chọn mặc định cho các trạng thái đơn giản.
- **`useReducer`** phù hợp hơn khi trạng thái phức tạp hoặc cần quản lý nhiều hành động. Nó giúp code dễ bảo trì và tái sử dụng hơn, nhưng đòi hỏi viết code nhiều hơn.

Nếu bạn cần ví dụ cụ thể hơn hoặc giải thích sâu về một trường hợp cụ thể, hãy cho mình biết nhé!

## Bài tập
Refactor Cart App:
Thêm Reducer quản lý cart
Custom hook cho logic add/remove
Kết nối API NodeJS Products, làm CRUD đầy đủ trên React

* Custom lại hook Cart sử dụng **useReducer()**
```javascript
// hooks/useCart.jsx
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

```
