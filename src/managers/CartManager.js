import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class CartManager {
    constructor() {
        this.path = path.join(__dirname, '../data/carts.json');
    }

    async getCarts() {
        const data = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = { id: Date.now().toString(), products: [] };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(c => c.id == id);
    }

    async addProductToCart(cid, pid) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id == cid);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.product === pid);
        if (productIndex === -1) {
            cart.products.push({ product: pid, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }

    async updateCart(id, updates) {
        const carts = await this.getCarts();
        const index = carts.findIndex(c => c.id == id);
        if (index === -1) return null;
        delete updates.id; // evitar modificar el ID
        carts[index] = { ...carts[index], ...updates };
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return carts[index];
    }

    async deleteCart(id) {
        const carts = await this.getCarts();
        const filtered = carts.filter(c => c.id != id);
        if (filtered.length === carts.length) return null; // no se encontró el carrito
        await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
        return true;
    }

    async removeProductFromCart(cid, pid) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id == cid);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.product === pid);
        if (productIndex === -1) return null;

        cart.products.splice(productIndex, 1);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}

export default CartManager;
