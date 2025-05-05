import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Detail = () => {
  const [product, setProduct] = useState(null);
  let { id } = useParams();

  useEffect(() => {
    fetch("https://dummyjson.com/products/" + id)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        console.log(data);
      })
      .catch((error) => console.log(error));
  }, [id]);

  return (
    <div>
      {product ? (
        <>
          <img src={product.thumbnail} alt={product.title} />
          <br />
          <br />    
          <h1 style={{textAlign:'left'}}>{product.title}</h1>
          <p>{product.description}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Detail;
