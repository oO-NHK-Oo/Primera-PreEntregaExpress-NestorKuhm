import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




function validateDataFromProduct(product) {
	if (!product.title) {
		throw new Error("Missing title information");
	}
	if (!product.description) {
		throw new Error("Missing description information");
	}
	if (!product.code) {
		throw new Error("Missing code information");
	}
	if (!product.price) {
		throw new Error("Missing price information");
	}
	if (!product.status) {
		throw new Error("Missing status information");
	}
	if (!product.stock) {
		throw new Error("Missing stock information");
	}
	if (!product.category) {
		throw new Error("Missing category information");
	}
}

module.exports = validateDataFromProduct;

export default __dirname;