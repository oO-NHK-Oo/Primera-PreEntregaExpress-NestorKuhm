const express = require("express");
const { ProductManager } = require("../product-manager.js");
const validateDataFromProduct = require("../utils/utils.js");

const productManager = new ProductManager("./src/productos.json");

const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
	if (req.query.limit < 1) {
		return res
			.status(400)
			.send({ message: "Límite no válido, debe ser mayor que cero" });
	}

	let limit = req.query.limit;
	let allProducts = await productManager.getProducts();
	let productsRequested = [];

	if (limit) {
		
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
			message: `El producto con el id ${pid} no existe`,
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
			message: "Producto añadido con éxito",
			idAssigned: idNewProduct,
		});
	} catch (error) {
		res.status(500).send({
			message: "Lo siento ah ocurrido un error..",
			details: error.message,
		});
	}
	return;
});

productsRouter.put("/:pid", async (req, res) => {
	if (req.body.id) {
		return res
			.status(400)
			.send({ message: "El id del producto no se puede modificar." });
	}

	try {
		let newProductInfo = { ...req.body };
		const product = await productManager.updateProduct(
			req.params.pid,
			newProductInfo
		);
		res.status(200).send({ message: "Producto actualizado", product: product });
	} catch (error) {
		res.status(500).send({ message: "Lo siento ah ocurrido un error.." });
	}
	return;
});

productsRouter.delete("/:pid", async (req, res) => {
	try {
		let idDeleted = await productManager.deleteProduct(req.params.pid);
		res.status(200).send({ message: `Producto con el id ${idDeleted} eliminado` });
	} catch (error) {
		res
			.status(500)
			.send({ message: "Lo siento ah ocurrido un error", error: error });
	}
	return;
});

module.exports = { productsRouter};