import { Breadcrumb, Layout, Menu, theme } from "antd";

import { Pagination } from "antd";


import ProductList from "../components/product/ProductList";



const { Content } = Layout;


const HomePage = () => {

  console.log('home page');

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Content style={{marginTop:'30px', padding: "0 48px", minHeight: "60.5vh" }}>
      {/* <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb> */}
      <div
        style={{
          padding: 24,
          minHeight: 380, 
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
      <ProductList />
      </div>

     
    </Content>
  );
};
export default HomePage;
