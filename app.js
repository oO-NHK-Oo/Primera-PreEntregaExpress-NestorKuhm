const express = require("express");

const { productsRouter } = require("./src/routes/products.routes.js");
const { cartsRouter } = require("./src/routes/carts.routes.js");

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  API endpoints

app.use("/api/products", productsRouter);

app.use("/api/carts", cartsRouter);

//  API endpoints

app.listen(port, () => {
	console.log(`Server running in http://localhost:${port}`);
});