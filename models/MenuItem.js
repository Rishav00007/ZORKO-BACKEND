// const mongoose = require('mongoose');

// const addOnSchema = new mongoose.Schema({
//   name: { type: String, required: true },       // e.g., "Extra Cheese"
//   price: { type: Number, required: true },
//   isAvailable: { type: Boolean, default: true }
// });

// const variantSchema = new mongoose.Schema({
//   name: { type: String, required: true },       // e.g., "Small", "Medium", "Large"
//   price: { type: Number, required: true }
// });

// const menuItemSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
//   image: { type: String },                       // Cloudinary URL
//   basePrice: { type: Number, required: true },
//   variants: [variantSchema],                     // Size options
//   addOns: [addOnSchema],                         // Extra toppings etc.
//   isVeg: { type: Boolean, default: false },
//   isAvailable: { type: Boolean, default: true },
//   isFeatured: { type: Boolean, default: false },
//   tags: [String],                                // e.g., "Spicy", "Bestseller"
// }, { timestamps: true });

// module.exports = mongoose.model('MenuItem', menuItemSchema);



const mongoose = require('mongoose');

const addOnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true }
});

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { type: String },
  basePrice: { type: Number, required: true },
  variants: [variantSchema],
  addOns: [addOnSchema],
  isVeg: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  tags: [String],
  averageRating: { type: Number, default: 0 },  // ✅ NEW
  numReviews: { type: Number, default: 0 },      // ✅ NEW
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);