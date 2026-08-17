const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        match: [/^[\w.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address']
    },
    password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);