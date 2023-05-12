const express = require("express");
const ProductManager = require('./ProductManager.js');
const app = express();

const port = 3000;

const pm = new ProductManager("./products.json");

app.use(express.json());

app.get("/products", (req, res) => {
  const limit = parseInt(req.query.limit);
  const finalProducts = [];
  let products = pm.getAllProducts();

  for (let i = 0; i < limit; i++) {
    if(i < products.length){
      finalProducts.push(products[i]);
    } 
  }
  
  res.send(finalProducts)
  
});


app.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  try{

    const producto = pm.getProductById(productId);
    res.send(producto);
  }
  catch(error){

    res.status(404).send({ errorMessage: error });
  }

});



app.listen(port, () => {

  console.log(`Example app listening on port http://localhost:${port}`);

});