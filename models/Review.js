const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
  customerName: { type: String },
}, { timestamps: true });

// One review per user per item
reviewSchema.index({ menuItem: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);