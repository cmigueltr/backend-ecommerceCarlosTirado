import express from 'express';
const app = express();
const PORT = 8080;

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

app.use(express.json());

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'API de E-commerce funcionando correctamente',
        endpoints: {
            products: '/api/products',
            carts: '/api/carts'
        }
    });
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
