const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor() {
        this.path = path.join(__dirname, '../data/products.json');
    }

    async getProducts() {
        const data = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id == id);
    }

    async addProduct(productData) {
        const products = await this.getProducts();
        const newProduct = {
            id: Date.now().toString(),
            ...productData
        };
        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updates) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id == id);
        if (index === -1) return null;
        delete updates.id; // evitar modificar el ID
        products[index] = { ...products[index], ...updates };
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const filtered = products.filter(p => p.id != id);
        await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
        return true;
    }
}

module.exports = ProductManager;
