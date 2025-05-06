import React from "react";
import { Link } from "react-router-dom";
export const Header = () => {
  return (
    <header style={{marginBottom:'30px'}}>
      <div className="topnav">
        <Link to='/home'>
          Home
        </Link>
        <Link to='/products'>Product</Link>
        <Link to='/Cart'>Cart</Link>
       
      </div>
    </header>
    
  );
};

