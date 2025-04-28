# Day-13: useEffect Hook , Lifecycle trong Function Component ,Call API (fetch/axios)l



### 1. useEffect Hook

Hook useEffect cho phép thực hiện các tác vụ phụ (side effects) trong function component, ví dụ như cập nhật DOM, gọi API, hoặc thiết lập bộ đếm thời gian. Nó chạy sau mỗi lần render, nhưng có thể kiểm soát thông qua mảng phụ thuộc (dependency array).

#### Cú pháp
```jsx
import { useEffect } from 'react';

useEffect(() => {
  // Side effect code here
  return () => {
    // Cleanup code (optional)
  };
}, [dependencies]);
```
#### Example
```jsx
import { useEffect, useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
    return () => {
      document.title = 'React App';
    };
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      Increment: {count}
    </button>
  );
}
```
* Mảng phụ thuộc rỗng ([]): Chỉ chạy một lần sau khi component được render lần đầu.
* Không có mảng phụ thuộc: Chạy sau mỗi lần render.
* Có mảng phụ thuộc: Chạy khi các giá trị trong mảng phụ thuộc thay đổi.

### 2. Vòng Đời (Lifecycle) trong Function Component

Function component không có các phương thức vòng đời như class component (ví dụ: componentDidMount), nhưng useEffect có thể thay thế:

##### Giai đoạn Mounting (Gắn vào)
```jsx
useEffect(() => {
  console.log('Component được gắn vào');
}, []);
```
#### Giai đoạn Updating (Cập nhật)
```jsx
useEffect(() => {
  console.log('Component được cập nhật');
}, [someProp, someState]);
```
#### Giai đoạn Unmounting (Gỡ bỏ)
```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Bộ đếm đang chạy');
  }, 1000);
  return () => {
    clearInterval(timer);
    console.log('Component đã gỡ bỏ');
  };
}, []);
```
### 3. Gọi API (fetch/axios)

#### Sử dụng fetch
fetch là API có sẵn trong JavaScript để thực hiện các yêu cầu HTTP.
```jsx
import { useEffect, useState } from 'react';

function FetchExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Lỗi:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Đang tải...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```
#### Sử dụng axios

Axios là một thư viện phổ biến để thực hiện các yêu cầu HTTP, cung cấp khả năng xử lý lỗi tốt hơn và cấu hình dễ dàng.
```jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function AxiosExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://api.example.com/data')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Lỗi:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Đang tải...</div>;
  return <div>{JSON.stringify(data)}</div>;
}
```
#### Lưu ý
* Luôn xử lý trạng thái tải (loading) và lỗi (error).
* Sử dụng try/catch với async/await để mã dễ đọc hơn.
* Thêm hàm dọn dẹp trong useEffect để tránh rò rỉ bộ nhớ (ví dụ: hủy yêu cầu fetch).

### Demo giao diện 
![alt text](./screenshots/image.png)
### Cách chạy project
* cd vào dường dẫn gốc thư mục /reactjs/day-13
* mở cmd chạy lệnh npm install 
* Tiếp tục npm run dev