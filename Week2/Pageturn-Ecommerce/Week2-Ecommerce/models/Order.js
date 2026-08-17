const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    orderNumber: { type: Number, required: true, unique: true },
    status: { type: String, default: 'completed' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);