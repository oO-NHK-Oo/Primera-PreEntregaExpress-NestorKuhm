const fs = require("fs");
const { v4 } = require("uuid");

class ProductManager {
	#products;
	#path;
	constructor(Path) {
		this.#products = [];
		this.productsWereModified = true; 
		this.#path = Path;


		
		if (!fs.existsSync(this.#path)) {
			fs.writeFileSync(this.#path, "[]");
		}
	}
	async addProduct(Product) {
		

		if (!Product.title) {
			throw new Error("Title field invalid");
		}
		if (!Product.description) {
			throw new Error("Description field invalid");
		}
		if (!Product.price) {
			throw new Error("Price field invalid");
		}
		if (!Product.code) {
			throw new Error("Code field invalid");
		}
		if (!Product.stock) {
			throw new Error("Stock field invalid");
		}

		
		if (!fs.existsSync(this.#path)) {
			await fs.promises.writeFile(this.#path, "[]");
		}

		
		const product = JSON.parse(
			await fs.promises.readFile(this.#path, "utf-8")
		).find((product) => product.code === Product.code);

		
		if (product) {
			throw new Error("There is a product with the same code");
		}

		let id = v4();

		const productToStore = { ...Product, id: id };

		let productsStored = JSON.parse(
			await fs.promises.readFile(this.#path, "utf-8")
		);
		productsStored.push(productToStore);
		await fs.promises.writeFile(this.#path, JSON.stringify(productsStored));
		this.productsWereModified = true;
		return id;
	}
	async getProducts() {
		if (this.productsWereModified == false) {
			return this.#products;
		}

		if (!fs.existsSync(this.#path)) {
			throw new Error("There isnt exists the file were products are stored");
		}
		let products = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));
		this.#products = products; 
		return products;
	}
	async getProductById(anId) {
		let product = undefined;
		if (this.productsWereModified == false) {
			product = this.#products.find((product) => product.id.includes(anId));
			if (!product) throw new Error("Product doesnt exists");
			return product;
		}

		if (!fs.existsSync(this.#path)) {
			throw new Error("There isnt exists the file were products are stored");
		}
		let products = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));

		product = products.find((product) => product.id.includes(anId));
		if (!product) throw new Error("Product doesnt exists");

		this.#products = products; 
		this.productsWereModified = false;
		return product;
	}
	async updateProduct(anId, productUpdated) {
		if (!fs.existsSync(this.#path)) {
			throw new Error("There isnt exists the file were products are stored");
		}

		
		let products = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));
		let product = products.find((product) => product.id.includes(anId));

		
		product = { ...product, ...productUpdated };

		

		products = products.filter((product) => !product.id.includes(anId));
		
		products.push(product);
		await fs.promises.writeFile(this.#path, JSON.stringify(products));

		this.productsWereModified = true;

		return product;
	}
	async deleteProduct(Id) {
		if (!fs.existsSync(this.#path)) {
			throw new Error("There isnt exists the file were products are stored");
		}

		let products = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));

		let productToDelete = products.find((product) => product.id.includes(Id));

		if (!productToDelete) {
			throw new Error(
				`Cannot delete a product. Doesnt exists a product with id ${Id}`
			);
		}
		products = products.filter((product) => !product.id.includes(Id));
		await fs.promises.writeFile(this.#path, JSON.stringify(products));

		this.productsWereModified = true;
		return Id;
	}
	existsProductWithID(ProductID) {
		let result;

		if (this.productsWereModified) {
			let products = fs.readFileSync(this.#path, "utf-8");
			result = products.some((product) => product.id.includes(ProductID));

			this.#products = products;
			this.productsWereModified = false;
		} else {
			result = this.#products.some((product) =>
				product.id.includes(ProductID)
			);
		}
		if (!result) throw new Error("Search of product by id result in undefined");
		return result;
	}
}

module.exports = { ProductManager };