import React, { useState, useEffect, useRef } from "react";
import { Layout, Menu, Badge, AutoComplete, Input } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import useCart from "../hooks/useCart";
import useProduct from "../hooks/useProduct";

const { Header } = Layout;

const rawItems = [
  { path: "/home", title: "Home" },
  { path: "/cart", title: "Cart" },
  { path: "/about", title: "About" },
  { path: "/blog", title: "Blog" },
];

const formatMenuItems = (items) =>
  items.map((item) => ({
    key: item.path,
    label: <Link to={item.path}>{item.title}</Link>,
    children: item.children ? formatMenuItems(item.children) : undefined,
  }));

const HeaderLayout = () => {
  const { cartItems } = useCart();
  const { searchProduct } = useProduct();

  const [options, setOptions] = useState([]);
  const debounceRef = useRef(null); // lưu timer

  const onChange = (value) => {
    // xóa timer cũ 
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // nếu rỗng thì xóa kết quả và không gọi API
    if (!value) {
      setOptions([]);
      return;
    }

    // tạo timer mới
    debounceRef.current = setTimeout(() => {
      searchProduct(value).then((products) => {
        const formatted = products.map((item) => ({
          value: item.name,
          label: (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{item.name}</span>
              <span style={{ color: "#999" }}>{item.price}đ</span>
            </div>
          ),
        }));
        setOptions(formatted);
      });
    }, 500); 
  };

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        background: "#001529",
      }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["/home"]}
        items={formatMenuItems(rawItems)}
        style={{ flex: 1, minWidth: 0 }}
      />

      <AutoComplete
        options={options}
        style={{ width: 300, marginRight: 20 }}
        onSearch={onChange}
        placeholder="Search products..."
      >
        <Input.Search size="middle" enterButton={false} />
      </AutoComplete>
      
      <Link to="/cart">
        <Badge count={cartItems.length} showZero>
          <ShoppingCartOutlined style={{ fontSize: 24, color: "white" }} />
        </Badge>
      </Link>
    </Header>
  );
};

export default HeaderLayout;
