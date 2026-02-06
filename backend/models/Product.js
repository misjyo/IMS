import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    quantity: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;