import { Router } from "express";
import Products from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import mongoose from "mongoose";

const router = Router();

// Página de inicio
router.get("/", (req, res) => {
  res.render("home");
});

// Listado de productos con paginación
router.get("/products", async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const result = await Products.paginate({}, { page: parseInt(page), limit: 10 });
    
    res.render("products", {
      products: result.docs,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/views/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/views/products?page=${result.nextPage}` : null
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.render("products", {
      products: [],
      page: 1,
      totalPages: 0,
      hasPrevPage: false,
      hasNextPage: false,
      prevLink: null,
      nextLink: null,
      error: 'Error al cargar productos'
    });
  }
});

// Detalle de producto
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await Products.findById(req.params.pid);
    res.render("productDetail", { product });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.render("productDetail", { product: null, error: 'Error al cargar el producto' });
  }
});

// Carrito del usuario (ruta simplificada)
router.get("/cart", async (req, res) => {
  try {
    const cartId = 'user-cart-1'; // ID personalizado
    let cart = await Cart.findById(cartId).populate("products.product");
    
    if (cart) {
      // Calcular subtotales para cada producto
      const productsWithSubtotal = cart.products.map(item => {
        const subtotal = item.product.price * item.quantity;
        
        // Crear un objeto plano con todas las propiedades
        const productData = {
          product: {
            _id: item.product._id,
            title: item.product.title,
            price: item.product.price,
            description: item.product.description,
            category: item.product.category,
            stock: item.product.stock,
            available: item.product.available
          },
          quantity: item.quantity,
          subtotal: subtotal
        };
        
        return productData;
      });
      
      // Reemplazar los productos con los que tienen subtotal
      cart.products = productsWithSubtotal;
    }
    
    // Si no existe el carrito, crear uno vacío
    if (!cart) {
      cart = new Cart({ _id: cartId, products: [] });
      await cart.save();
    }
    
    res.render("cart", { cart });
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.render("cart", { cart: null, error: `Error al cargar el carrito: ${error.message}` });
  }
});

// Carrito por ID (ruta original)
router.get("/carts/:cid", async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate("products.product");
  res.render("cart", { cart });
});

export default router;
