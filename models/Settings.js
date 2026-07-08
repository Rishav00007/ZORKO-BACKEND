// const mongoose = require('mongoose');

// const settingsSchema = new mongoose.Schema({
//   isOpen: { type: Boolean, default: true },
//   estimatedDeliveryTime: { type: String, default: '30-45 mins' },
// }, { timestamps: true });

// module.exports = mongoose.model('Settings', settingsSchema);


const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  isOpen: { type: Boolean, default: true },
  estimatedDeliveryTime: { type: String, default: '30-45 mins' },
  heroBanner: {                                          // ✅ NEW
    title: { type: String, default: '🍴 Welcome!' },
    subtitle: { type: String, default: 'Fresh food, delivered to your door' },
    badge: { type: String, default: 'Enjoy Free Delivery on Orders above ₹200 🎉' },
    bgColor1: { type: String, default: '#7C3AED' },
    bgColor2: { type: String, default: '#a855f7' },
    imageUrl: { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);