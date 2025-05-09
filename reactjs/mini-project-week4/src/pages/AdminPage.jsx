import React, { useState , useEffect} from "react";
import {
  Layout,
  Pagination,
  Col,
  Row,
  Button,
  notification,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
} from "antd";
import { Link } from "react-router-dom";
import useProduct from "../hooks/useProduct";


const urlServer = "http://localhost:3000/admin";
const FakeTokenAdmin =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsIm5hbWUiOiJhIiwiZW1haWwiOiJhQGEuYSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0Njc2MTAwNywiZXhwIjoxNzc4MzE4NjA3fQ.Pu8iu33RPpRdh0D83URrtEThNkhBRhU_oT3cw1j2Jco";

const pageSize = 12;


const AdminPage = () => {
  console.log('admin page re render');
  const [form] = Form.useForm();
  const { page,setPage ,products, fetchProducts } = useProduct();
  
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [api, contextHolder] = notification.useNotification();


  useEffect(() => {
      fetchProducts();
    }, [page]);

  const showAddModal = () => {
    form.resetFields();
    setIsAddModalVisible(true);
  };

  const showEditModal = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      category: product.category,
    });
    setIsEditModalVisible(true);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
    form.resetFields();
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const handleAddProduct = async (values) => {
    try {
      const response = await fetch(urlServer + "/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${FakeTokenAdmin}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Thêm sản phẩm thất bại");
      }
      message.success("Sản phẩm đã được thêm thành công");
      setIsAddModalVisible(false);
      form.resetFields();
      setPage((pre) => 1);

    
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleEditProduct = async (values) => {
    try {
      const response = await fetch(
        urlServer + `/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${FakeTokenAdmin}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Sửa sản phẩm thất bại");
      }

      message.success("Sản phẩm đã được cập nhật thành công");
      setIsEditModalVisible(false);
      setEditingProduct(null);
      form.resetFields();
       setPage((pre) => 1);
      
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(urlServer + `/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${FakeTokenAdmin}`,
        },
      });

      if (!response.ok) {
        throw new Error("Xóa sản phẩm thất bại");
      }

      message.success("Sản phẩm đã được xóa thành công");
      setPage((pre) => 1);
     
    } catch (error) {
      message.error(error.message);
    }
  };

  const ProductForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={editingProduct ? handleEditProduct : handleAddProduct}
    >
      <Form.Item
        name="name"
        label="Tên sản phẩm"
        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="price"
        label="Giá"
        rules={[{ required: true, message: "Vui lòng nhập giá sản phẩm" }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="stock"
        label="Số lượng"
        rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="description"
        label="Mô tả"
        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="category"
        label="Danh mục"
        rules={[{ required: true, message: "Vui lòng nhập danh mục" }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );

  return (
    <div>
      {contextHolder}
      <Button
        type="primary"
        onClick={showAddModal}
        style={{ marginBottom: 16 }}
      >
        Thêm sản phẩm
      </Button>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={8} key={product.id}>
            <div
              className="product-item"
              style={{
                padding: "20px",
                height: "300px",
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
                alt={product.name}
              />
              <Link to={`/product/${product.id}`}>
                <h3>{product.name}</h3>
              </Link>
              <p>Price: ${product.price.toFixed(2)}</p>
              <div>
                <Button
                  onClick={() => showEditModal(product)}
                  style={{ marginRight: 8 }}
                >
                  Sửa
                </Button>
                <Popconfirm
                  title="Bạn có chắc muốn xóa sản phẩm này?"
                  onConfirm={() => handleDeleteProduct(product.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button style={{ color: "red", background: "white" }}>
                    Xóa
                  </Button>
                </Popconfirm>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <Pagination
        current={page}
        pageSize={pageSize}
        align="center"
        total={60}
        onChange={(page) => {setPage(page)}}
        style={{ textAlign: "center", marginTop: "20px" }}
      />

      <Modal
        title="Thêm sản phẩm mới"
        open={isAddModalVisible}
        onCancel={handleAddCancel}
        footer={[
          <Button key="cancel" onClick={handleAddCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Thêm
          </Button>,
        ]}
      >
        <ProductForm />
      </Modal>

      <Modal
        title="Sửa sản phẩm"
        open={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={[
          <Button key="cancel" onClick={handleEditCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Lưu
          </Button>,
        ]}
      >
        <ProductForm />
      </Modal>
    </div>
  );
};

export default AdminPage;
