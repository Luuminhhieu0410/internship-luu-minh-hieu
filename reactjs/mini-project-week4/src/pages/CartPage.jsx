import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Cart from '../components/cart/Cart';
const { Header, Content, Footer } = Layout;

const AboutPage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
 
      <Content style={{marginTop:'30px', padding: '0 48px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            padding: 24,
            minHeight: 380,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
         <Cart /> 
        </div>
      </Content>
   
  );
};
export default AboutPage;