## Day 26: Tổng quan Remix + Setup Shopify Remix App
## Nội dung chính
* Giới thiệu Remix framework
* Vì sao Shopify chọn Remix làm default App framework?
* Setup dự án Remix với Shopify CLI
* Cấu trúc chuẩn 1 Remix Shopify App
* Data Loader, Action, Route in Remix
---
## Giải thích 

### 1. **Giới thiệu Remix framework**

**Remix** là một framework JavaScript full-stack hiện đại, được thiết kế để xây dựng các ứng dụng web nhanh, đáng tin cậy và dễ mở rộng. Nó được phát triển bởi đội ngũ đứng sau React Router và ra mắt lần đầu vào năm 2020. Remix tận dụng các tính năng của React để xây dựng giao diện người dùng (UI), đồng thời cung cấp các công cụ mạnh mẽ để xử lý dữ liệu phía server.

#### Đặc điểm chính của Remix:
- **Server-side rendering (SSR) và Static Site Generation (SSG):** Remix cho phép render giao diện phía server, cải thiện hiệu suất và SEO.
- **File-based routing:** Cấu trúc thư mục trong dự án Remix tự động ánh xạ thành các route trong ứng dụng (tương tự Next.js).
- **Data Loading và Mutations:** Remix cung cấp các khái niệm **Loader** và **Action** để xử lý dữ liệu một cách đơn giản, tích hợp chặt chẽ giữa client và server.
- **Progressive Enhancement:** Các ứng dụng Remix hoạt động tốt ngay cả khi JavaScript bị tắt, đảm bảo khả năng truy cập.
- **Built-in Error Handling:** Remix tự động quản lý lỗi và hiển thị giao diện lỗi phù hợp.
- **Hỗ trợ TypeScript:** Remix tích hợp tốt với TypeScript, giúp lập trình viên viết mã an toàn hơn.

#### Lợi ích của Remix:
- Tăng tốc độ tải trang nhờ tối ưu hóa dữ liệu và render.
- Giảm độ phức tạp khi quản lý trạng thái giữa client và server.
- Cung cấp trải nghiệm phát triển mượt mà với các công cụ tích hợp.

---

### 2. **Vì sao Shopify chọn Remix làm default App framework?**

Shopify, một nền tảng thương mại điện tử hàng đầu, đã chọn **Remix** làm framework mặc định cho việc phát triển ứng dụng (Shopify Apps) từ năm 2022. Điều này xuất phát từ các lý do sau:

#### a. **Hiệu suất vượt trội**
- Remix tối ưu hóa việc tải dữ liệu bằng cách chỉ gửi dữ liệu cần thiết từ server đến client, giảm thời gian tải trang.
- Shopify cần các ứng dụng nhanh để đảm bảo trải nghiệm người dùng tốt trên các cửa hàng trực tuyến, và Remix đáp ứng được yêu cầu này.

#### b. **Tích hợp tốt với Shopify**
- Remix hỗ trợ các API của Shopify (như Storefront API và Admin API) một cách dễ dàng, giúp lập trình viên truy vấn dữ liệu cửa hàng, sản phẩm, đơn hàng, v.v.
- Các tính năng như **Loader** và **Action** của Remix phù hợp để xử lý các tác vụ phức tạp như xác thực người dùng, quản lý giỏ hàng, hoặc đồng bộ dữ liệu với Shopify.

#### c. **Cộng đồng và hệ sinh thái**
- Remix được xây dựng bởi đội ngũ có kinh nghiệm với React, đảm bảo tính ổn định và tương thích với các thư viện React mà Shopify đã sử dụng.
- Shopify đã chuyển từ **Ruby on Rails** sang các công nghệ JavaScript hiện đại hơn (như React và Node.js), và Remix là bước tiến hợp lý trong hệ sinh thái này.

#### d. **Tính đơn giản và dễ học**
- Remix có cách tiếp cận đơn giản, với các khái niệm như file-based routing và Loader/Action, giúp lập trình viên mới dễ dàng bắt đầu.
- Shopify muốn giảm rào cản cho các nhà phát triển bên thứ ba khi xây dựng ứng dụng cho nền tảng của họ.

#### e. **Hỗ trợ phát triển ứng dụng nhúng (Embedded Apps)**
- Shopify Apps thường được nhúng trực tiếp vào Shopify Admin (qua iframe). Remix cung cấp các công cụ để quản lý xác thực (OAuth) và giao tiếp với Shopify App Bridge, giúp việc phát triển các ứng dụng nhúng trở nên dễ dàng hơn.

#### f. **Khả năng mở rộng**
- Remix hỗ trợ các ứng dụng từ nhỏ đến lớn, phù hợp với các nhà phát triển cá nhân lẫn doanh nghiệp lớn xây dựng ứng dụng phức tạp cho Shopify.

---

### 3. **Setup dự án Remix với Shopify CLI**

**Shopify CLI** (Command Line Interface) là công cụ chính thức của Shopify để tạo, quản lý và triển khai các ứng dụng Shopify. Dưới đây là các bước chi tiết để thiết lập một dự án Remix sử dụng Shopify CLI.

#### Bước 1: Cài đặt Shopify CLI
- Đảm bảo bạn đã cài Node.js (phiên bản được đề xuất: 16 hoặc cao hơn).
- Cài đặt Shopify CLI toàn cầu bằng npm:
  ```bash
  npm install -g @shopify/cli @shopify/app
  ```

#### Bước 2: Tạo dự án Remix mới
- Chạy lệnh sau để tạo một ứng dụng Shopify sử dụng Remix:
  ```bash
  shopify app init
  ```
- Chọn **Remix** khi được hỏi về framework (Shopify CLI sẽ tự động tạo cấu trúc dự án Remix).
- Đặt tên cho ứng dụng và chọn tổ chức (organization) trên Shopify Partner Dashboard.

#### Bước 3: Cấu hình ứng dụng
- Sau khi tạo, Shopify CLI sẽ tạo một tệp `.env` với các biến môi trường cần thiết:
  ```env
  SHOPIFY_API_KEY=your_api_key
  SHOPIFY_API_SECRET=your_api_secret
  SCOPES=write_products,read_orders
  ```
- Cập nhật các giá trị này từ Shopify Partner Dashboard.

#### Bước 4: Chạy ứng dụng
- Di chuyển vào thư mục dự án:
  ```bash
  cd your-app-name
  ```
- Chạy server phát triển:
  ```bash
  shopify app dev
  ```
- Shopify CLI sẽ cung cấp một URL ngrok để kiểm tra ứng dụng trong môi trường sandbox.

#### Bước 5: Kiểm tra và triển khai
- Mở Shopify Partner Dashboard, thêm ứng dụng vào cửa hàng thử nghiệm.
- Triển khai ứng dụng lên Heroku hoặc một nền tảng khác khi sẵn sàng:
  ```bash
  shopify app deploy
  ```

#### Lưu ý:
- Đảm bảo đã đăng nhập vào Shopify CLI bằng lệnh `shopify login`.
- Kiểm tra các yêu cầu về OAuth và xác thực trong tài liệu Shopify.

---

### 4. **Cấu trúc chuẩn 1 Remix Shopify App**

Một dự án Remix Shopify App có cấu trúc thư mục được tổ chức rõ ràng. Dưới đây là cấu trúc cơ bản:

```
your-app-name/
├── app/
│   ├── routes/
│   │   ├── _index.jsx       # Route mặc định (trang chủ)
│   │   ├── products.jsx     # Route xử lý danh sách sản phẩm
│   │   └── [...].jsx        # Dynamic routes
│   ├── entry.server.jsx     # Server entry point
│   ├── entry.client.jsx     # Client entry point
│   ├── root.jsx             # Component gốc của ứng dụng
├── public/                  # Tệp tĩnh (hình ảnh, CSS, v.v.)
├── shopify.server.js        # Cấu hình Shopify (API, OAuth)
├── package.json             # Quản lý dependencies
├── vite.config.js           # Cấu hình Vite (bundler)
└── .env                     # Biến môi trường
```

#### Giải thích các thành phần chính:
- **app/routes/**: Chứa các file định nghĩa route. Tên file ánh xạ trực tiếp tới URL (ví dụ: `products.jsx` → `/products`).
- **app/root.jsx**: Component gốc, chứa layout chung cho toàn bộ ứng dụng.
- **shopify.server.js**: File cấu hình kết nối với Shopify API, xử lý xác thực OAuth và các middleware.
- **entry.server.jsx**: Định nghĩa cách render ứng dụng phía server.
- **entry.client.jsx**: Định nghĩa cách hydrate ứng dụng phía client.

---

### 5. **Data Loader, Action, Route in Remix**

Remix sử dụng các khái niệm **Loader**, **Action**, và **Route** để quản lý dữ liệu và định tuyến trong ứng dụng. Dưới đây là giải thích chi tiết:

#### a. **Route**
- **Route** trong Remix được định nghĩa bằng các file trong thư mục `app/routes/`.
- Mỗi file `.jsx` hoặc `.tsx` đại diện cho một route. Ví dụ:
  - `app/routes/_index.jsx` → Route `/`
  - `app/routes/products.jsx` → Route `/products`
- Dynamic route sử dụng dấu ngoặc vuông, ví dụ: `app/routes/products/[id].jsx` → Route `/products/:id`.

#### b. **Data Loader**
- **Loader** là một hàm chạy phía server để tải dữ liệu trước khi render một route.
- Mỗi route có thể export một hàm `loader`:
  ```jsx
  import { json } from "@remix-run/node";
  import { shopify } from "~/shopify.server";

  export async function loader({ request }) {
    const { admin } = await shopify(request);
    const response = await admin.rest.resources.Product.all({
      session: shopify.session,
    });
    return json({ products: response.data });
  }
  ```
- Dữ liệu từ `loader` có thể được truy cập trong component bằng hook `useLoaderData`:
  ```jsx
  import { useLoaderData } from "@remix-run/react";

  export default function Products() {
    const { products } = useLoaderData();
    return (
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.title}</li>
        ))}
      </ul>
    );
  }
  ```

#### c. **Action**
- **Action** là hàm chạy phía server để xử lý các request POST, PUT, DELETE (thường từ form submissions).
- Mỗi route có thể export một hàm `action`:
  ```jsx
  import { json } from "@remix-run/node";
  import { shopify } from "~/shopify.server";

  export async function action({ request }) {
    const formData = await request.formData();
    const productName = formData.get("name");
    const { admin } = await shopify(request);
    await admin.rest.resources.Product.create({
      session: shopify.session,
      title: productName,
    });
    return json({ success: true });
  }
  ```
- Action được gọi khi một form được submit:
  ```jsx
  import { Form } from "@remix-run/react";

  export default function NewProduct() {
    return (
      <Form method="post">
        <input type="text" name="name" />
        <button type="submit">Add Product</button>
      </Form>
    );
  }
  ```

#### Tích hợp với Shopify:
- **Loader** thường được dùng để gọi Shopify API (lấy sản phẩm, đơn hàng, v.v.).
- **Action** được dùng để thực hiện các tác vụ như tạo sản phẩm, cập nhật đơn hàng, hoặc xử lý webhook.

---

