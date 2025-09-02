// src/managers/ProductManager.js

import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export default class ProductManager {
  constructor() {
    this.path = './data/products.json';
  }

  /**
   * Obtiene la lista completa de productos desde el archivo JSON.
   */
  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, devolvemos un array vacío
      if (error.code === 'ENOENT') return [];
      throw new Error('Error al leer productos: ' + error.message);
    }
  }

  /**
   * Obtiene un producto según su ID único.
   */
  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  /**
   * Agrega un nuevo producto validando los campos requeridos.
   */
  async addProduct(productData) {
    const products = await this.getProducts();

    // Validaciones
    if (!productData.title || !productData.price) {
      throw new Error('El producto debe tener título y precio');
    }

    if (typeof productData.price !== 'number' || productData.price <= 0) {
      throw new Error('El precio debe ser un número positivo');
    }

    const exists = products.some(p => p.title.toLowerCase() === productData.title.toLowerCase());
    if (exists) {
      throw new Error('Ya existe un producto con ese título');
    }

    // Crear nuevo producto con ID único
    const newProduct = {
      id: uuidv4(), // Generamos ID con uuid
      ...productData,
    };

    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));

    return newProduct;
  }

  /**
   * Actualiza los campos de un producto existente.
   */
  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    // Evitar que se intente modificar el ID
    if (updates.id) delete updates.id;

    products[index] = { ...products[index], ...updates };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));

    return products[index];
  }

  /**
   * Elimina un producto según su ID.
   */
  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);

    if (products.length === filtered.length) {
      throw new Error('No se encontró el producto a eliminar');
    }

    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return true;
  }
}
