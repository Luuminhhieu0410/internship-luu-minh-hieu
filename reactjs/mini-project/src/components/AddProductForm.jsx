import { useState } from 'react';

const AddProductForm = ({ onAddProduct }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [errors, setErrors] = useState({});
 
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Vui lòng nhập tên';
    if (!price || isNaN(price) || Number(price) <= 0) newErrors.price = 'Giá phải là số';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("data add " + title + " "+ price  + " "+ thumbnail);
    if (validateForm()) {
      onAddProduct({
        id: Date.now(),
        title,
        price: Number(price),
        thumbnail: thumbnail || '',
      });
      setTitle('');
      setPrice('');
      setThumbnail('');
    }
  };

  return (
    <div className="add-product-form">
      <h2>Add New Product</h2>
      <div>
        <input
          type="text"
          placeholder="Tên sản phẩm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className="error">{errors.title}</p>}
        <input
          type="number"
          placeholder="Giá "
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {errors.price && <p className="error">{errors.price}</p>}
        <input
          type="text"
          placeholder="Link ảnh"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
        />
        <button onClick={handleSubmit}>Add Product</button>
      </div>
    </div>
  );
};

export default AddProductForm;