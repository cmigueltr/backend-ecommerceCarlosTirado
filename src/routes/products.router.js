// src/routes/products.router.js

import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager();

/**
 * GET /
 * Lista de todos los productos.
 */
router.get('/', async (req, res) => {
  try {
    const products = await manager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /:pid
 * Obtiene un producto por ID.
 */
router.get('/:pid', async (req, res) => {
  try {
    const product = await manager.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /
 * Agrega un producto nuevo con validaciones.
 */
router.post('/', async (req, res) => {
  try {
    const product = await manager.addProduct(req.body);

    // Emitimos actualización en tiempo real
    const io = req.app.get('io');
    if (io) {
      io.emit('productos', await manager.getProducts());
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /:pid
 * Actualiza un producto existente.
 */
router.put('/:pid', async (req, res) => {
  try {
    const updated = await manager.updateProduct(req.params.pid, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('productos', await manager.getProducts());
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /:pid
 * Elimina un producto existente.
 */
router.delete('/:pid', async (req, res) => {
  try {
    await manager.deleteProduct(req.params.pid);

    const io = req.app.get('io');
    if (io) {
      io.emit('productos', await manager.getProducts());
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
