const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  isOpen: { type: Boolean, default: true },
  estimatedDeliveryTime: { type: String, default: '30-45 mins' },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);