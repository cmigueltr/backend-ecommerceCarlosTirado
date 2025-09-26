import { Router } from "express";
import Cart from "../models/cart.model.js";

const router = Router();

// Crear un carrito vacío
router.post("/", async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener carrito por ID (populate)
router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product");
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    let cart = await Cart.findById(cid);
    
    // Si el carrito no existe, crearlo
    if (!cart) {
      cart = new Cart({ _id: cid, products: [] });
      await cart.save();
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({ error: error.message });
  }
});

// Actualizar todos los productos de un carrito
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar cantidad de un producto específico
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    const product = cart.products.find(p => p.product.toString() === pid);
    if (product) product.quantity = quantity;

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
    cart.products = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
