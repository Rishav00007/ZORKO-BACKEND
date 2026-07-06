
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: String,
  image: String,
  variant: { name: String, price: Number },
  addOns: [{ name: String, price: Number }],
  quantity: Number,
  itemTotal: Number,
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: String,
  customerPhone: String,
  deliveryAddress: {
    fullAddress: { type: String, required: true },
    landmark: String,
    pincode: String,
    coordinates: {           // ✅ NEW — for GPS
      lat: { type: Number },
      lng: { type: Number },
    }
  },
  items: [orderItemSchema],
  subtotal: Number,
  deliveryCharge: { type: Number, default: 0 },
  totalAmount: Number,
  paymentScreenshot: { type: String },
  paymentStatus: {
    type: String,
    enum: ['pending', 'screenshot_submitted', 'verified', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'cod'],
    default: 'online'
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  whatsappSent: { type: Boolean, default: false },
  notes: String,
}, { timestamps: true });

// ✅ FIX: Don't pass `next` in async middleware — just use return
orderSchema.pre('save', async function () {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
  }
});

module.exports = mongoose.model('Order', orderSchema);