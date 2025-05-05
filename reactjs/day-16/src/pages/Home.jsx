import React from 'react';
import ProductList from '../components/ProductList';
const Home = props => {
  console.log('re-render Home page');
    return (
          <ProductList />
    );
};


export default Home