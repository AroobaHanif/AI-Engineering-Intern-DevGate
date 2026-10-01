const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: { type: String, required: true },
    content: {type: String, required: true },
});

const conversationSchema = new mongoose.Schema({
    title: { type: String, default: 'New Chat' },
    summary: { type: String, default: '' },   // Stores Summary here
    messages: [messageSchema],
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);