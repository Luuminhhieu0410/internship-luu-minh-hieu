import React from "react";
import { useRoutes, BrowserRouter } from "react-router-dom";
import Detail from "../pages/Detail";
import Home from "../pages/Home";
import Cart from "../components/Cart";
import {MainLayout} from "../layout/MainLayout";

const routes = [
  {
 
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true, // ✅ Đảm bảo Home hiển thị khi vào "/"
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "products",
        element: <Home />,
      },
      {
        path: "product/:id",
        element: <Detail />,
      },
    ],
  }
];

export const AllRoutes = () => {

  const element = useRoutes(routes);
  return (
    <>
    {element}
    </>
  )
};
