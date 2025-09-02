import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManager from './managers/ProductManager.js';

const app = express();
const PORT = 8080;

// --- Handlebars ---
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

// --- Rutas API / Views ---
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// --- Servidor + Socket.io ---
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const io = new Server(server);
app.set('io', io);

const productManager = new ProductManager();

io.on('connection', async (socket) => {
  console.log('Cliente conectado (socket.id):', socket.id);

  // Enviar productos actuales al cliente
  const productos = await productManager.getProducts().catch(() => []);
  socket.emit('productos', productos);

  // Crear producto desde cliente
  socket.on('nuevoProducto', async (producto) => {
    try {
      // Validación y normalización
      if (!producto.title || typeof producto.title !== 'string' || !producto.title.trim()) {
        throw new Error('El producto debe tener un título válido');
      }

      const price = Number(producto.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('El producto debe tener un precio válido mayor que 0');
      }

      const description = producto.description ? String(producto.description).trim() : '';

      const newProduct = {
        title: producto.title.trim(),
        price,
        description
      };

      const added = await productManager.addProduct(newProduct);
      console.log('Producto agregado:', added);

      const updated = await productManager.getProducts();
      io.emit('productos', updated);

    } catch (err) {
      console.error('Error al agregar producto:', err.message);
      socket.emit('error', 'No se pudo crear el producto: ' + err.message);
    }
  });

  // Eliminar producto desde cliente
  socket.on('eliminarProducto', async (id) => {
    try {
      await productManager.deleteProduct(id);
      const updated = await productManager.getProducts();
      io.emit('productos', updated);
    } catch (err) {
      console.error('Error al eliminar producto:', err.message);
      socket.emit('error', 'No se pudo eliminar el producto: ' + err.message);
    }
  });
});
