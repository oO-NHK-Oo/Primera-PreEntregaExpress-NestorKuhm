const { v4 } = require("uuid");
const fs = require("fs");

function generateNewEmptyCart() {
	const newCart = {
		id: v4(),
		products: [],
	};
	return newCart;
}

class CartsManager {
	#path;
	#carts;
	constructor(Path) {
		this.#path = Path;
		this.#carts = JSON.parse(fs.readFileSync(this.#path, "utf-8"));
	}
	addCart(Cart) {
		if (!Cart) throw new Error("Cart doesnt exists");
		if (!Cart.products)
			throw new Error("Cart must have a structure of products");

		this.#carts.push(Cart);

		fs.writeFileSync(this.#path, JSON.stringify(this.#carts));
	}
	productsOnCartById(CartID) {
		const cart = this.#carts.find((cart) => cart.id.includes(CartID));
		if (!cart) throw new Error(`Cart with id ${CartID} doesn't exists`);
		if (cart.products.length == 0)
			throw new Error("There are no products in the cart");
		return [...cart.products];
	}
	existsCartWithID(CartID) {
		return this.#carts.some((cart) => cart.id.includes(CartID));
	}
	addProductWithIDtoCartWithID(productId, cartId) {
		const cart = this.#carts.find((cart) => cart.id.includes(cartId));

		if (cart.products.some((product) => product.id.includes(productId))) {
			let product = cart.products.find((product) =>
				product.id.includes(productId)
			);
			product.quantity++;
		} else {
			cart.products.push({ id: productId, quantity: 1 });
		}
		fs.writeFileSync(this.#path, JSON.stringify(this.#carts));
	}
}

module.exports = { CartsManager, generateNewEmptyCart };