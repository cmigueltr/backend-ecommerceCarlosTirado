// src/routes/carts.router.js

import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const manager = new CartManager();

/**
 * GET /
 * Devuelve todos los carritos almacenados.
 */
router.get('/', async (req, res) => {
  try {
    const carts = await manager.getCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /:cid
 * Devuelve un carrito específico por su ID.
 */
router.get('/:cid', async (req, res) => {
  try {
    const cart = await manager.getCartById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /
 * Crea un nuevo carrito vacío.
 */
router.post('/', async (req, res) => {
  try {
    const newCart = await manager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /:cid/product/:pid
 * Agrega un producto a un carrito determinado.
 * Si el producto ya existe, incrementa la cantidad.
 */
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const updatedCart = await manager.addProductToCart(cid, pid, quantity || 1);

    res.json(updatedCart);
  } catch (error) {
    if (error.message.includes('no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

export default router;
