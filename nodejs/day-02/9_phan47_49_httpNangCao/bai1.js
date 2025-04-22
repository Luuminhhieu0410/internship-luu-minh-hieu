const express = require('express');
const app = express();
app.use(express.json());

let arrData = [];

app.get('/', (req, res) => {
  res.json({data: arrData });
});

app.post('/data', (req, res) => {
  const data = req.body;
  arrData.push(data);
  res.status(201).json({data });
});

app.listen(3000, () => {
  console.log('Server chạy trên cổng 3000');
});
