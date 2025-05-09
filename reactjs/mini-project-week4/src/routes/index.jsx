import { useRoutes } from "react-router-dom";

import MainLayout from "../layout/MainLayout";
import HomePage from "../pages/HomePage";
import DetailPage from "../pages/DetailPage";
import AboutPage from "../pages/AboutPage";
import BlogPage from "../pages/BlogPage";
import AdminPage from "../pages/AdminPage";
import CartPage from "../pages/CartPage";
const router = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path : "/product/:id",
        element : <DetailPage />
      },
      {
        path : "/About",
        element : <AboutPage />
      },
      {
        path : "/Blog",
        element : <BlogPage />
      },
      {
        path : "/Cart",
        element : <CartPage />
      },
      {
        path : "/Admin",
        element : <AdminPage />
      }
    ],
  },
];
const index = () => {
    const elements = useRoutes(router);
  return (
    <>
    {elements}
    </>
  )
};

export default index;
