const express = require("express");

const { productsRouter } = require("./src/routes/products.routes.js");
const { cartsRouter } = require("./src/routes/carts.routes.js");

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Products API endpoints
app.use("/api/products", productsRouter);

// Carts API endpoints
app.use("/api/carts", cartsRouter);

app.listen(port, () => {
	console.log(`Server running in http://localhost:${port}`);
});