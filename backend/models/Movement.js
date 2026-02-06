import mongoose from "mongoose";

const movementSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    reason: { type: String }, // optional: purchase , sale, damage
    timestamp: { type: Date, default: Date.now }
});

const Movement = mongoose.model('Movement', movementSchema);

export default Movement;