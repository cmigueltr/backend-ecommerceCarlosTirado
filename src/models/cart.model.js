import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 }
    }
  ]
}, {
  _id: false // Deshabilitar el _id automático
});

export default mongoose.model("Carts", cartSchema, "carts");
