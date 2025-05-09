import React from "react";
import {Outlet} from 'react-router-dom'
import HeaderLayout from "./HeaderLayout";
import FooterLayout from "./FooterLayout";
import { Layout } from "antd";
const MainLayout = () => {
  return (
    <Layout style={{width:"100%",maxWidth:'100%'}}>
        <HeaderLayout />
        <Outlet />
        <FooterLayout />
    </Layout>
  );
};

export default MainLayout;
