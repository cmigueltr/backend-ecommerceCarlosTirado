// src/managers/CartManager.js

import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import ProductManager from './ProductManager.js';

export default class CartManager {
  constructor() {
    this.path = './data/carts.json';
    this.productManager = new ProductManager();
  }

  /**
   * Obtiene todos los carritos almacenados.
   */
  async getCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw new Error('Error al leer carritos: ' + error.message);
    }
  }

  /**
   * Obtiene un carrito específico por su ID.
   */
  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === id);
  }

  /**
   * Crea un nuevo carrito vacío.
   */
  async createCart() {
    const carts = await this.getCarts();

    const newCart = {
      id: uuidv4(),
      products: []
    };

    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));

    return newCart;
  }

  /**
   * Agrega un producto a un carrito dado.
   * Si el producto ya está en el carrito, incrementa su cantidad.
   */
  async addProductToCart(cartId, productId, quantity = 1) {
    if (typeof quantity !== 'number' || quantity <= 0) {
      throw new Error('La cantidad debe ser un número positivo');
    }

    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(c => c.id === cartId);
    if (cartIndex === -1) {
      throw new Error('Carrito no encontrado');
    }

    // Verificar que el producto exista
    const product = await this.productManager.getProductById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    // Buscar producto en el carrito
    const productInCart = carts[cartIndex].products.find(p => p.product === productId);
    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      carts[cartIndex].products.push({ product: productId, quantity });
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return carts[cartIndex];
  }
}
