import {Router} from 'express';
const router = Router();
import CartManager from '../managers/CartManager.js';
const manager = new CartManager();

router.get('/', async (req, res) => {
    const carts = await manager.getCarts();
    res.json(carts);
});

router.post('/', async (req, res) => {
    const cart = await manager.createCart();
    res.status(201).json(cart);
});

router.get('/:cid', async (req, res) => {
    const cart = await manager.getCartById(req.params.cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cart = await manager.addProductToCart(req.params.cid, req.params.pid);
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.json(cart);
});

router.put('/:cid', async (req, res) => {
    const cart = await manager.updateCart(req.params.cid, req.body);
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.json(cart);
});

router.delete('/:cid', async (req, res) => {
    const deleted = await manager.deleteCart(req.params.cid);
    if (!deleted) return res.status(404).send('Carrito no encontrado');
    res.send('Carrito eliminado');
});

router.delete('/:cid/product/:pid', async (req, res) => {
    const cart = await manager.removeProductFromCart(req.params.cid, req.params.pid);
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.json(cart);
});

export default router;
