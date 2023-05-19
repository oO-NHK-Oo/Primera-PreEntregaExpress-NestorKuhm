const express = require("express");
const { CartsManager, generateNewEmptyCart } = require("../carts-manager");
const { productManager } = require("./products.routes");

const cartsRouter = express.Router();

const cartsManager = new CartsManager("./src/carrito.json");

cartsRouter.post("/", (req, res) => {
	const newCart = generateNewEmptyCart();

	try {
		cartsManager.addCart(newCart);
		return res.status(200).send({
			message: "New empty cart generated successfully",
			cartId: newCart.id,
			currentProducts: [],
		});
	} catch (error) {
		return res.status(500).send({ message: "Oops, something went wrong ... " });
	}
});

cartsRouter.get("/:cid", (req, res) => {
	let products = [];
	const cartID = req.params.cid;

	if (!cartID) {
		res.status(400).send({ message: "Cart id not found in request" });
	}

	try {
		products = cartsManager.productsOnCartById(cartID);
		return res
			.status(200)
			.send({ message: "Products queried successfully", products: products });
	} catch (error) {
		return res.status(500).send({ message: error.message });
	}
});

cartsRouter.post("/:cid/product/:pid", (req, res) => {
	const { cid, pid } = req.params;

	try {
		cartsManager.addProductWithIDtoCartWithID(pid, cid);

		return res
			.status(200)
			.send({ message: `Product with id ${pid} added to cart with id ${cid}` });
	} catch (error) {
		return res.status(400).send({ message: error.message });
	}
});

module.exports = { cartsRouter };