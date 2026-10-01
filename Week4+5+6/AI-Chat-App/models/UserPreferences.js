const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    tone: { type: String, enum: ['formal', 'casual'], default: 'casual' },
    language: { type: String, enum: ['English', 'Urdu'], default: 'English' },
}, { timestamps: true });

module.exports = mongoose.model('UserPreferences', preferencesSchema);