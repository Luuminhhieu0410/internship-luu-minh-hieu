import React from "react";
import { Layout,Pagination, Col, Row , Button, notification, Space  } from "antd";

import useCart from "../../hooks/useCart";
import useProduct from "../../hooks/useProduct";
import { Link } from "react-router-dom";
const pageSize = 12;
const ProductList = () => {
  const {setPage , page } = useProduct();
  
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = type => {
    api[type]({
      message: 'Thông báo',
      description:
        'Sản phẩm đã được thêm vào giỏ',
    }); 
  };
  const { addToCart } = useCart();
  const { products} = useProduct();
    console.log('Product list render');
  return (
    <div>
      {contextHolder}
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={8} key={product.id}>
            <div
              className="product-item"
              style={{
                padding: "20px",
                height: "250px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "white",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                style={{ maxWidth: "80%", height: "50%" }}
                src={
                  product.thumbnail ||
                  "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp"
                }
                alt={product.title}
              />
              <Link to={"/product/" + product.id}>
                <h3>{product.name}</h3>
              </Link>
              <p>Price: ${product.price.toFixed(2)}</p>
              <button
                onClick={() => {
                  openNotificationWithIcon('success')
                  addToCart(product);
                }}
              >
                Add to Cart
              </button>
            </div>
          </Col>
        ))}
      </Row>
       <br />
      <Pagination
        current={page}
        pageSize= {pageSize}
        align="center"
        total={60}
        onChange={(page) => setPage(page)}
        style={{ textAlign: "center", marginTop: "20px" }}
      />

    </div>
  );
};


export default ProductList;
