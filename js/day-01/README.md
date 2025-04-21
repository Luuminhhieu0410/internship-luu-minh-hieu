
# 📚 Kiến thức cơ bản về JavaScript ES6

Dưới đây là những kiến thức quan trọng và nền tảng về ES6 trong JavaScript:

---

## 1. 🔄 Phân biệt `var`, `let`, `const` và cách viết arrow function

### `var`, `let`, `const`:

| Thuộc tính         | `var`                | `let`                | `const`              |
|--------------------|----------------------|----------------------|----------------------|
| Phạm vi (Scope)    | Function             | Block                | Block                |
| Có thể gán lại     | ✅                   | ✅                   | ❌                   |
| Có thể khai báo lại| ✅                   | ❌                   | ❌                   |
| Hoisting           | ✅ (undefined)       | ✅ (TDZ*)            | ✅ (TDZ*)            |

> *TDZ: Temporal Dead Zone – không thể truy cập biến trước khi khai báo*

### Arrow Function:

```javascript
// Cách viết function bình thường
function sayHi(name) {
  return `Hi, ${name}`;
}

// Arrow function
const sayHi = (name) => `Hi, ${name}`;
```

---

## 2. 🌐 Cách sử dụng `spread`, `rest`, `destructuring`

### Spread Operator (`...`):

```javascript
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]
```

### Rest Parameters:

```javascript
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
```

### Destructuring:

```javascript
const user = { name: "Minh", age: 21 };
const { name, age } = user;

const arr = [1, 2, 3];
const [a, b] = arr;
```

---

## 3. 📦 Cách sử dụng module trong JS ES6

### Export:

```javascript
// math.js
export const sum = (a, b) => a + b;
export const multiply = (a, b) => a * b;
```

### Import:

```javascript
// main.js
import { sum, multiply } from './math.js';

console.log(sum(2, 3)); // 5
```

> Lưu ý: Muốn dùng `import/export`, file cần có type `"module"` trong `package.json` hoặc có phần mở rộng `.mjs`.

---

## 4. 🧠 Khác biệt giữa **Primitive vs Reference**

| Thuộc tính        | Primitive                        | Reference                          |
|-------------------|----------------------------------|------------------------------------|
| Kiểu dữ liệu      | string, number, boolean, null... | object, array, function            |
| So sánh           | So sánh giá trị                  | So sánh địa chỉ trong bộ nhớ       |
| Lưu trữ           | Stack                            | Heap                               |

### Ví dụ:

```javascript
let a = 5;
let b = a;
b = 10;
console.log(a); // 5

let obj1 = { name: 'Minh' };
let obj2 = obj1;
obj2.name = 'Hieu';
console.log(obj1.name); // 'Hieu'
```

---

## ✅ Tổng kết

- Hiểu rõ các biến (`var`, `let`, `const`) giúp tránh lỗi không mong muốn.
- Spread, rest và destructuring giúp viết code ngắn gọn hơn.
- Modules giúp chia nhỏ chương trình để tái sử dụng và dễ quản lý.
- Hiểu rõ sự khác biệt giữa primitive và reference giúp tránh bug khi xử lý object và array.

---




