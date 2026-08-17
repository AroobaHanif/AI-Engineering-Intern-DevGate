const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        match: [/^[\w.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address']
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);