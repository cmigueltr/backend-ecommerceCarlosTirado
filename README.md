# 🛍️ E-commerce Backend

Un e-commerce completo desarrollado con Node.js, Express, MongoDB y Handlebars. Incluye gestión de productos, carrito de compras, API REST y interfaz web.

## 🚀 Características

- **Gestión de Productos**: CRUD completo con paginación
- **Carrito de Compras**: Agregar, eliminar y gestionar productos
- **API REST**: Endpoints para productos y carritos
- **Interfaz Web**: Páginas con Handlebars y CSS moderno
- **Base de Datos**: MongoDB con Mongoose
- **Diseño Responsive**: Compatible con móviles y desktop

## 📋 Requisitos

- Node.js (versión 16 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd proyecto_backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar MongoDB**
   - Crear una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas) (gratis)
   - Crear un cluster
   - Obtener la cadena de conexión
   - Reemplazar la URL en `src/app.js` línea 37:
   ```javascript
   mongoose.connect("TU_CADENA_DE_CONEXION_AQUI")
   ```

4. **Importar productos de ejemplo**
```bash
npm run import-products
```

5. **Iniciar el servidor**
```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

## 🌐 URLs del Proyecto

- **🏠 Página de Inicio**: `http://localhost:8080/views`
- **📦 Lista de Productos**: `http://localhost:8080/views/products`
- **🛒 Carrito de Compras**: `http://localhost:8080/views/cart`
- **🔗 API de Productos**: `http://localhost:8080/api/products`
- **🔗 API de Carritos**: `http://localhost:8080/api/carts`

## 📚 API Endpoints

### Productos
- `GET /api/products` - Listar productos (con paginación)
- `GET /api/products?page=1&limit=10` - Paginación
- `GET /api/products?sort=asc` - Ordenar por precio
- `GET /api/products?query=Electrónicos` - Filtrar por categoría

### Carritos
- `POST /api/carts` - Crear carrito
- `GET /api/carts/:cid` - Obtener carrito
- `POST /api/carts/:cid/products/:pid` - Agregar producto al carrito
- `PUT /api/carts/:cid/products/:pid` - Actualizar cantidad
- `DELETE /api/carts/:cid/products/:pid` - Eliminar producto del carrito
- `DELETE /api/carts/:cid` - Vaciar carrito

## 🗂️ Estructura del Proyecto

```
proyecto_backend/
├── package.json
├── README.md
└── src/
    ├── app.js                 # Configuración principal
    ├── models/
    │   ├── product.model.js   # Modelo de productos
    │   └── cart.model.js      # Modelo de carritos
    ├── routes/
    │   ├── products.router.js # Rutas API de productos
    │   ├── carts.router.js    # Rutas API de carritos
    │   └── views.router.js    # Rutas de vistas web
    ├── views/
    │   ├── layouts/
    │   │   └── main.handlebars # Layout principal
    │   ├── home.handlebars     # Página de inicio
    │   ├── products.handlebars # Lista de productos
    │   ├── productDetail.handlebars # Detalle de producto
    │   └── cart.handlebars     # Carrito de compras
    ├── public/
    │   └── css/
    │       └── styles.css      # Estilos CSS
    ├── data/
    │   └── products.json       # Productos de ejemplo
    └── scripts/
        └── importProducts.js   # Script de importación
```

## 🎨 Funcionalidades

### Gestión de Productos
- Lista paginada de productos
- Detalle individual de cada producto
- Filtros por categoría
- Ordenamiento por precio

### Carrito de Compras
- Agregar productos al carrito
- Ver productos en el carrito
- Calcular subtotales automáticamente
- Eliminar productos del carrito
- Vaciar carrito completo

### Interfaz Web
- Diseño moderno y responsive
- Navegación intuitiva
- Mensajes de confirmación
- Manejo de errores

## 🛠️ Scripts Disponibles

```bash
npm start              # Iniciar servidor en modo producción
npm run dev            # Iniciar servidor en modo desarrollo (nodemon)
npm run import-products # Importar productos de ejemplo a MongoDB
```

## 🗄️ Base de Datos

### Colecciones MongoDB

**products** - Productos del e-commerce
```javascript
{
  title: String (requerido),
  description: String,
  price: Number (requerido),
  category: String (requerido),
  stock: Number (default: 0),
  available: Boolean (default: true)
}
```

**carts** - Carritos de compras
```javascript
{
  _id: String,
  products: [{
    product: ObjectId (ref: "Product"),
    quantity: Number (default: 1)
  }]
}
```

## 🚀 Despliegue

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:
```
MONGODB_URI=tu_cadena_de_conexion_mongodb
PORT=8080
```

### Heroku
1. Crear app en Heroku
2. Conectar con GitHub
3. Configurar variables de entorno
4. Desplegar

### Vercel/Netlify
- Configurar build command: `npm install`
- Start command: `npm start`
- Configurar variables de entorno

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia ISC.

## 👨‍💻 Autor

Desarrollado con ❤️ usando Node.js, Express, MongoDB y Handlebars.

---

**¡Disfruta explorando el e-commerce!** 🛍️✨