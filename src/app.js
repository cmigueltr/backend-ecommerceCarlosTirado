// src/app.js
import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js'; // nuevo router de vistas
import ProductManager from './managers/ProductManager.js';

const app = express();
const PORT = 8080;

// --- Handlebars ---
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // para formularios si los usás por HTTP
app.use(express.static('./src/public')); // archivos públicos (js, css)

// --- Rutas API / Views ---
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter); // maneja "/" y "/realtimeproducts"

// --- Servidor HTTP + Socket.io ---
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const io = new Server(server);

// Exponer io para acceder desde rutas (evita circular imports)
app.set('io', io);

// Instancia de manager para emitir productos iniciales
const productManager = new ProductManager();

io.on('connection', async (socket) => {
  console.log('Cliente conectado (socket.id):', socket.id);

  // Enviamos la lista actual de productos al cliente recién conectado
  const productos = await productManager.getProducts().catch(() => []);
  socket.emit('productos', productos);

  // Escuchar evento para crear producto desde cliente via socket
  socket.on('nuevoProducto', async (producto) => {
    try {
      await productManager.addProduct(producto);
      const updated = await productManager.getProducts();
      io.emit('productos', updated); // notificar a todos
    } catch (err) {
      socket.emit('error', 'No se pudo crear el producto');
      console.error(err);
    }
  });

  // Escuchar evento para eliminar producto via socket
  socket.on('eliminarProducto', async (id) => {
    try {
      await productManager.deleteProduct(id);
      const updated = await productManager.getProducts();
      io.emit('productos', updated);
    } catch (err) {
      socket.emit('error', 'No se pudo eliminar el producto');
      console.error(err);
    }
  });
});