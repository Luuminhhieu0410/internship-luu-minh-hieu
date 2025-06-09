import express from 'express';
import fs from 'fs';
import cors from 'cors'
const app = express();
const port = 3000;

const ACCESS_TOKEN = 'shpua_52abe11b3b244cd72f044e2fcf0f4783';
const corsOptions = {
  origin: 'https://shop-sieu-vip.myshopify.com',
  optionsSuccessStatus: 200 
}
app.use(express.json());
app.use(cors(corsOptions))
app.get('/test', (req,res) => {
    res.send(123);
})
app.get('/webhooks/product/delete',(req,res) =>{
    res.send('webhooks được kích hoạt trong method get')
    console.log('webhooks được kích hoạt trong method get');
})
app.post("/product/variants", (req,res) =>{
    const {productId} = req.body;
    console.log("productID : " + productId);
    if(!productId) return res.status(400).send('thiếu dữ liệu');

    fetch(`https://shop-sieu-vip.myshopify.com/admin/api/2025-04/products/${productId}/variants.json`, {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": ACCESS_TOKEN
        }
      }).then(response=> response.json()).then(data => {
        return res.status(200).json(data);
      }).catch((err) => {
        console.log("errors " + err);
        return res.status(400).json({"errors ": err});
      })
})
app.post('/webhooks/product/delete',(req,res) =>{
    const time = new Date().toLocaleString();
    
    res.send('webhooks được kích hoạt trong method post')

    console.log('webhooks được kích hoạt trong method post');
    console.log(JSON.stringify(req.body));
    console.log("header :  " + JSON.stringify(req.headers));
    
    const {id} = req.body;
    if(!id) return res.send('không có data');
    fs.appendFile('product_delete.txt',`id : ${id} | time : ${time} \n`,(err) => {
        if(err){
            console.log(err);
            return res.send(err);
        }
    })


    
})
app.listen(port,() => {
    console.log(`server is running at http://localhost:${port} `)
})      