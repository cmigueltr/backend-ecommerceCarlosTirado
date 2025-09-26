import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  available: { type: Boolean, default: true }
});

productSchema.plugin(mongoosePaginate);

// Forzar el uso de la colección 'products' específicamente
const Product = mongoose.model("Product", productSchema, "products");
export default Product;
