const express = require("express");
const { ProductManager } = require("../product-manager.js");
const validateDataFromProduct = require("../utils/utils.js");

const productManager = new ProductManager("./src/productos.json");

const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
	if (req.query.limit < 1) {
		return res
			.status(400)
			.send({ message: "Invalid limit, must be greater than zero" });
	}

	let limit = req.query.limit;
	let allProducts = await productManager.getProducts();
	let productsRequested = [];

	if (limit) {
		// if the limit exceeds the number of products the limit is equal to that number. I did this to avoid nulls in the productsRequested due to the for loop
		if (limit > allProducts.length) {
			limit = allProducts.length;
		}
		for (let i = 0; i < limit; i++) {
			productsRequested.push(allProducts[i]);
		}
		res.status(200).send({ products: productsRequested });
	} else {
		res.status(200).send({ products: allProducts });
	}
});

productsRouter.get("/:pid", async (req, res) => {
	const pid = req.params.pid;

	try {
		const product = await productManager.getProductById(pid);
		res.status(200).send({ product: product });
	} catch (error) {
		res.status(404).send({
			message: `Product with id ${pid} doesnt exists`,
			info: error.message,
		});
	}
	return;
});

productsRouter.post("/", async (req, res) => {
	const newProduct = req.body;
	try {
		validateDataFromProduct(newProduct);
		let idNewProduct = await productManager.addProduct(newProduct);
		res.status(200).send({
			message: "Product added successfully",
			idAssigned: idNewProduct,
		});
	} catch (error) {
		res.status(500).send({
			message: "Oops something goes wrong ...",
			details: error.message,
		});
	}
	return;
});

productsRouter.put("/:pid", async (req, res) => {
	if (req.body.id) {
		return res
			.status(400)
			.send({ message: "The product id cannot be modified" });
	}

	try {
		let newProductInfo = { ...req.body };
		const product = await productManager.updateProduct(
			req.params.pid,
			newProductInfo
		);
		res.status(200).send({ message: "Product Updated", product: product });
	} catch (error) {
		res.status(500).send({ message: "Oops, something went wrong ..." });
	}
	return;
});

productsRouter.delete("/:pid", async (req, res) => {
	try {
		let idDeleted = await productManager.deleteProduct(req.params.pid);
		res.status(200).send({ message: `Product with id ${idDeleted} deleted` });
	} catch (error) {
		res
			.status(500)
			.send({ message: "Oops, something went wrong ...", error: error });
	}
	return;
});

module.exports = { productsRouter};