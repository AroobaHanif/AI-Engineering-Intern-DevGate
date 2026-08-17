const mongoose = require('mongoose');

const GENRES = [
    'Fiction', 'Non-Fiction', 'Fantasy', 'Mystery & Thriller',
    'Romance', 'Sci-Fi', 'Horror', 'Biography',
    'Self-Help', 'History', 'Poetry', "Children's",
];

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true, enum: GENRES },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    stock: { type: Number, default: 0 },
}, { timestamps: true });

productSchema.statics.GENRES = GENRES;

module.exports = mongoose.model('Product', productSchema);