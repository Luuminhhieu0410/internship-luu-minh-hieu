import { createContext, useEffect, useState } from 'react';
import { getProductPage, searchProduct as _searchProduct } from '../api/ProuductApi';
import { useSearchParams } from 'react-router-dom';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  console.log('product context render');
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;


  const fetchProducts = async () => {
    try {
      const res = await getProductPage(page);
      setProducts(res);
    } catch (err) {
      console.error('lỗi khi lấy sản phẩm:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);


  const updatePage = (newPage) => {
    setSearchParams({ page: newPage });
  };


  const searchProduct = async (keyword) => {
    try {
      const data = await _searchProduct(keyword);
      setProducts(data);
    } catch (err) {
      console.error('lỗi khi tìm kiếm sản phẩm:', err);
    }
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        page,
        setPage: updatePage,
        searchProduct,
        refreshProducts, 
       fetchProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};