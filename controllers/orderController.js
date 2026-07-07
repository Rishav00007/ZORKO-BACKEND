



// const Order = require('../models/Order');
// const Coupon = require('../models/Coupon');
// const { sendOrderNotification } = require('../utils/whatsapp');
// const { sendOrderEmail } = require('../utils/email');

// const placeOrder = async (req, res) => {
//   try {
//     const { customerName, customerPhone, subtotal, deliveryCharge, notes, paymentMethod, couponCode } = req.body;
//     const items = JSON.parse(req.body.items);
//     const deliveryAddress = JSON.parse(req.body.deliveryAddress);
//     const paymentScreenshot = req.file ? req.file.path : null;

//     // ✅ Validate and apply coupon server-side
//     let discountAmount = 0;
//     let appliedCouponCode = null;
//     if (couponCode) {
//       const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim(), isActive: true });
//       if (coupon && Number(subtotal) >= coupon.minOrderAmount) {
//         discountAmount = coupon.discountType === 'percentage'
//           ? Math.round(Number(subtotal) * coupon.discountValue / 100)
//           : Math.min(coupon.discountValue, Number(subtotal));
//         appliedCouponCode = coupon.code;
//         await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
//       }
//     }

//     // ✅ Backend calculates final total (secure)
//     const finalTotal = Number(subtotal) + (Number(deliveryCharge) || 0) - discountAmount;

//     const order = await Order.create({
//       customer: req.user ? req.user._id : null,
//       customerName, customerPhone, deliveryAddress, items,
//       subtotal: Number(subtotal),
//       deliveryCharge: Number(deliveryCharge) || 0,
//       totalAmount: finalTotal,
//       discountAmount,
//       couponCode: appliedCouponCode,
//       paymentScreenshot,
//       paymentMethod: paymentMethod || 'online',
//       paymentStatus: paymentMethod === 'cod' ? 'pending' : paymentScreenshot ? 'screenshot_submitted' : 'pending',
//       notes,
//     });

//     const sent = await sendOrderNotification(order);
//     await sendOrderEmail(order);
//     if (sent) { order.whatsappSent = true; await order.save(); }

//     res.status(201).json({ success: true, orderNumber: order.orderNumber, _id: order._id });
//   } catch (error) {
//     console.error('Place order error:', error.message);
//     res.status(500).json({ message: error.message });
//   }
// };

// const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ customer: req.user._id }).sort('-createdAt');
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: 'Order not found' });
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { placeOrder, getMyOrders, getOrderById };



const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Settings = require('../models/Settings');      // ✅ NEW import
const { sendOrderNotification } = require('../utils/whatsapp');
const { sendOrderEmail } = require('../utils/email');

const placeOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, subtotal, deliveryCharge, notes, paymentMethod, couponCode } = req.body;
    const items = JSON.parse(req.body.items);
    const deliveryAddress = JSON.parse(req.body.deliveryAddress);
    const paymentScreenshot = req.file ? req.file.path : null;

    // ✅ Fetch current delivery time from settings at moment of order placement
    let estimatedDeliveryTime = '30-45 mins';
    try {
      const settings = await Settings.findOne();
      if (settings?.estimatedDeliveryTime) {
        estimatedDeliveryTime = settings.estimatedDeliveryTime;
      }
    } catch (e) { /* use default if settings fetch fails */ }


    // ✅ Validate and apply coupon server-side
    let discountAmount = 0;
    let appliedCouponCode = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim(), isActive: true });
      if (coupon && Number(subtotal) >= coupon.minOrderAmount) {
        discountAmount = coupon.discountType === 'percentage'
          ? Math.round(Number(subtotal) * coupon.discountValue / 100)
          : Math.min(coupon.discountValue, Number(subtotal));
        appliedCouponCode = coupon.code;
        await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
      }
    }

    // ✅ Backend calculates final total (secure)
    const finalTotal = Number(subtotal) + (Number(deliveryCharge) || 0) - discountAmount;

    const order = await Order.create({
      customer: req.user ? req.user._id : null,
      customerName, customerPhone, deliveryAddress, items,
      subtotal: Number(subtotal),
      deliveryCharge: Number(deliveryCharge) || 0,
      totalAmount: finalTotal,
      discountAmount,
      couponCode: appliedCouponCode,
      estimatedDeliveryTime,        // ✅ Saved at time of order
      paymentScreenshot,
      paymentMethod: paymentMethod || 'online',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : paymentScreenshot ? 'screenshot_submitted' : 'pending',
      notes,
    });

    const sent = await sendOrderNotification(order);
    await sendOrderEmail(order);
    if (sent) { order.whatsappSent = true; await order.save(); }

    res.status(201).json({ success: true, orderNumber: order.orderNumber, _id: order._id });
  } catch (error) {
    console.error('Place order error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeOrder, getMyOrders, getOrderById };