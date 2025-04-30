const ProductItem = ({ product, onAdd }) => {
  return (
    <div className="product-item">
      <img src={product.thumbnail} alt={product.title} />
      <h3>{product.title}</h3>
      <p>Price: ${product.price.toFixed(2)}</p>
      <button onClick={() => onAdd(product)}>Add to Cart</button>
    </div>
  );
};

export default ProductItem;