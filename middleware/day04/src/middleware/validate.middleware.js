

export  function validateProduct(req, res, next) {
    const { name, price, stock, description, category } = req.body;
  
    if (!name || !price || !stock || !description || !category) {
      return res.status(400).json({ error: "Missing required fields." });
    }
  
    if (typeof name !== "string" || typeof description !== "string" || typeof category !== "string") {
      return res.status(400).json({ error: "Name, description, and category must be strings." });
    }
  
    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({ error: "Price must be a positive number." });
    }
  
    if (!Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({ error: "Stock must be a non-negative integer." });
    }
    next(); 
  }
  
  