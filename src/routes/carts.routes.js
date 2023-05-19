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
			message: "Nuevo carrito vacío generado con éxito",
			cartId: newCart.id,
			currentProducts: [],
		});
	} catch (error) {
		return res.status(500).send({ message: "Lo siento ah ocurrido un error " });
	}
});

cartsRouter.get("/:cid", (req, res) => {
	let products = [];
	const cartID = req.params.cid;

	if (!cartID) {
		res.status(400).send({ message: "ID de carrito no encontrado" });
	}

	try {
		products = cartsManager.productsOnCartById(cartID);
		return res
			.status(200)
			.send({ message: "Productos consultados con éxito", products: products });
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
			.send({ message: `Producto con el id ${pid} agregado al carrito con id ${cid}` });
	} catch (error) {
		return res.status(400).send({ message: error.message });
	}
});

module.exports = { cartsRouter };