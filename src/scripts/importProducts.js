// Script para importar productos desde JSON a MongoDB
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Products from '../models/product.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexión a MongoDB - CAMBIAR ESTA URL POR LA TUYA
// Obtener la URL desde variables de entorno o usar la URL por defecto
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://cmiguel:car1mi23@cluster0.2kr0ip9.mongodb.net/bizzco?retryWrites=true&w=majority&appName=Cluster0";

async function importProducts() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Leer el archivo JSON
    const jsonPath = path.join(__dirname, '../data/products.json');
    const productsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    console.log(`📦 Leyendo ${productsData.length} productos desde el archivo JSON...`);

    // Limpiar productos existentes (opcional)
    await Products.deleteMany({});
    console.log('🗑️ Productos existentes eliminados');

    // Insertar productos
    const insertedProducts = await Products.insertMany(productsData);
    console.log(`✅ ${insertedProducts.length} productos importados exitosamente`);

    // Mostrar algunos productos importados
    console.log('\n📋 Primeros 5 productos importados:');
    insertedProducts.slice(0, 5).forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - $${product.price} (${product.category})`);
    });

  } catch (error) {
    console.error('❌ Error al importar productos:', error);
  } finally {
    // Cerrar conexión
    await mongoose.disconnect();
    console.log('🔌 Conexión a MongoDB cerrada');
    process.exit(0);
  }
}

// Ejecutar el script
importProducts();
