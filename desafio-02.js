const fs = require('fs');

class ProductManager {
  constructor(filePath = 'products.json') {
    this.path = filePath; // Ruta del archivo de productos
    this.products = [];
    this.loadProducts(); // Cargar productos al instanciar la clase.
  }

  // Método para agregar un producto al arreglo de productos.
  addProduct(product) {
    // Validar que el producto tenga todos los campos obligatorios.
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.log("Error: Todos los campos son obligatorios.");
      return;
    }

    // Obtener el último ID y calcular el siguiente.
    const lastId = this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
    const productId = lastId + 1;

    // Asignar el ID al producto.
    product.id = productId;

    // Agregar el producto al arreglo de productos.
    this.products.push(product);

    // Guardar productos en el archivo.
    this.saveProducts();

    // Imprimir un mensaje de éxito.
    console.log(`Producto '${product.title}' añadido con éxito. (ID: ${productId})`);
  }

  // Método para obtener todos los productos.
  getProducts() {
    return this.products;
  }

  // Método para obtener un producto por su ID.
  getProductById(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      return product;
    } else {
      console.log(`Error: Producto con ID ${productId} no encontrado.`);
      return null;
    }
  }

  // Método para actualizar un producto por su ID y campos a actualizar.
  updateProduct(productId, updatedFields) {
    const productIndex = this.products.findIndex((p) => p.id === productId);
    if (productIndex !== -1) {
      // Actualizar campos especificados en el objeto.
      for (const key in updatedFields) {
        if (updatedFields.hasOwnProperty(key)) {
          this.products[productIndex][key] = updatedFields[key];
        }
      }

      // Guardar productos actualizados en el archivo.
      this.saveProducts();

      console.log(`Producto con ID ${productId} actualizado con éxito.`);
    } else {
      console.log(`Error: Producto con ID ${productId} no encontrado.`);
    }
  }

  // Método para eliminar un producto por su ID.
  deleteProduct(productId) {
    const index = this.products.findIndex((p) => p.id === productId);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts(); // Guardar productos después de eliminar uno.
      console.log(`Producto con ID ${productId} eliminado.`);
    } else {
      console.log(`Error: Producto con ID ${productId} no encontrado.`);
    }
  }

  // Método para guardar los productos en un archivo.
  saveProducts() {
    const productsJSON = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, productsJSON);
    console.log(`Productos guardados en el archivo "${this.path}".`);
  }

  // Método para cargar productos desde un archivo.
  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
      console.log(`Productos cargados desde el archivo "${this.path}".`);
    } catch (error) {
      console.log(`No se pudo cargar el archivo "${this.path}". Se iniciará con una lista vacía de productos.`);
      this.products = [];
    }
  }
}


const productManager = new ProductManager('custom_products.json');



// Agregar productos
productManager.addProduct({
  title: "Wisky",
  description: "12 años",
  price: 5000,
  thumbnail: "img1-jpg",
  code: "w1",
  stock: 50
});

productManager.addProduct({
  title: "Cerveza",
  description: "SOLERA",
  price: 4000,
  thumbnail: "img2-jpg",
  code: "c1",
  stock: 30
});

// Obtener todos los productos.
const allProducts = productManager.getProducts();
console.log("Todos los productos:", allProducts);

// Obtener un producto por su ID.
const productById = productManager.getProductById(allProducts[0].id);
if (productById) {
  console.log("Producto por ID:", productById);
}

// Actualizar un producto por su ID y campos a actualizar.
const productIdToUpdate = allProducts[0].id;
productManager.updateProduct(productIdToUpdate, { price: 5500, stock: 60 });

// Eliminar un producto por su ID.
const productIdToDelete = allProducts[1].id;
productManager.deleteProduct(productIdToDelete);
