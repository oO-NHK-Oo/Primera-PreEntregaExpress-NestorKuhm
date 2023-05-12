const fs = require("fs");

class ProductManager {
    idCounter;
  
    constructor(aPath) {
      this.idCounter = JSON.parse(fs.readFileSync(aPath,"utf-8")).length;
      this.path = aPath;
    }
    addProduct(product) {
      if (!product.title) {
        throw "Title field invalid";
      }
      if (!product.description) {
        throw "Description field invalid";
      }
      if (!product.price) {
        throw "Price field invalid";
      }
      if (!product.thumbnail) {
        throw "Thumbnail field invalid";
      }
      if (!product.code) {
        throw "Code field invalid";
      }
      if (!product.stock) {
        throw "Stock field invalid";
      }
  
      const productos = JSON.parse(fs.readFileSync(this.path,"utf-8"));

      const result = productos.find((prod) => prod.code === product.code);
  
      if (result) {
        throw "already exists a product with the same code";
      }
  
      this.idCounter++;
      productos.push({ ...product, id: this.idCounter });

      fs.writeFileSync(this.path,JSON.stringify(productos));
    }
    getAllProducts() {
      return JSON.parse(fs.readFileSync(this.path,"utf-8"));
    }
    getProductById(id) {
      const product = JSON.parse(fs.readFileSync(this.path,"utf-8")).find((product) => product.id === id);
      if (!product) throw "Product not found";
  
      return product;
    }
    updateProduct(anId,newData){
      // primero obtengo la lista de productos leyendo el archivo
      let products = JSON.parse(fs.readFileSync(this.path,"utf-8"));
      
      // encontrar el producto que queremos actualizar
      const productToBeUpdated = products.find( (product) => product.id === anId);
      
      // quitar la info vieja de los productos
      products = products.filter((product) => product.id != anId);
      
      // agrego el producto con la nueva info actualizada
      products.push({...productToBeUpdated,...newData});

      //ahora bajo la estructura de productos al archivo
      fs.writeFileSync(this.path,JSON.stringify(products));
    }
    deleteProduct(anId){
        // Tengo que levantar/leer los productos del archivo
        let products = JSON.parse(fs.readFileSync(this.path,"utf-8"));

        // Encontrar el producto
        // Eliminarlo
        products = products.filter((product) => product.id != anId);
        
        // Lo guardo en el archivo
        fs.writeFileSync(this.path,JSON.stringify(products));
    }
  }

module.exports = ProductManager