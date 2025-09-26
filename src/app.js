import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

// Routers
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de handlebars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine("handlebars", engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/views", viewsRouter);

// Conexión Mongo
mongoose
  .connect("mongodb+srv://cmiguel:car1mi23@cluster0.2kr0ip9.mongodb.net/bizzco?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
  })
  .catch((err) => console.error("Error en MongoDB:", err));
