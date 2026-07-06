






// const Order = require('../models/Order');
// const { sendOrderNotification } = require('../utils/whatsapp');
// const { sendOrderEmail } = require('../utils/email'); // ✅ ADD THIS



// const placeOrder = async (req, res) => {
//   try {
//     const {
//       customerName,
//       customerPhone,
//       subtotal,
//       deliveryCharge,
//       totalAmount,
//       notes,
//       paymentMethod,   // ✅ THIS WAS MISSING
//     } = req.body;

//     const items = JSON.parse(req.body.items);
//     const deliveryAddress = JSON.parse(req.body.deliveryAddress);
//     const paymentScreenshot = req.file ? req.file.path : null;

//     const order = await Order.create({
//       customer: null,
//       customerName,
//       customerPhone,
//       deliveryAddress,
//       items,
//       subtotal: Number(subtotal),
//       deliveryCharge: Number(deliveryCharge) || 0,
//       totalAmount: Number(totalAmount),
//       paymentScreenshot,
//       paymentMethod: paymentMethod || 'online',   // ✅ NOW SAVED CORRECTLY
//       paymentStatus: paymentMethod === 'cod'
//         ? 'pending'
//         : paymentScreenshot ? 'screenshot_submitted' : 'pending',
//       notes,
//     });

//     const sent = await sendOrderNotification(order);
//     await sendOrderEmail(order); // ✅ ADD THIS — runs alongside WhatsApp
//     if (sent) { order.whatsappSent = true; await order.save(); }

//     res.status(201).json({ success: true, orderNumber: order.orderNumber, _id: order._id });

//   } catch (error) {
//     console.error('Place order error:', error.message);
//     res.status(500).json({ message: error.message });
//   }
// };

// // @GET /api/orders/my
// const getMyOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ customer: req.user._id }).sort('-createdAt');
//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @GET /api/orders/:id
// const getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: 'Order not found' });
//     if (
//       order.customer?.toString() !== req.user._id.toString() &&
//       req.user.role !== 'admin'
//     ) {
//       return res.status(403).json({ message: 'Not allowed' });
//     }
//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { placeOrder, getMyOrders, getOrderById };





const Order = require('../models/Order');
const { sendOrderNotification } = require('../utils/whatsapp');
const { sendOrderEmail } = require('../utils/email');

// @POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const {
      customerName, customerPhone,
      subtotal, deliveryCharge,
      totalAmount, notes, paymentMethod,
    } = req.body;

    const items = JSON.parse(req.body.items);
    const deliveryAddress = JSON.parse(req.body.deliveryAddress); // includes coordinates if provided
    const paymentScreenshot = req.file ? req.file.path : null;

    const order = await Order.create({
      customer: req.user ? req.user._id : null,  // ✅ link if logged in
      customerName,
      customerPhone,
      deliveryAddress,          // ✅ contains coordinates if auto-located
      items,
      subtotal: Number(subtotal),
      deliveryCharge: Number(deliveryCharge) || 0,
      totalAmount: Number(totalAmount),
      paymentScreenshot,
      paymentMethod: paymentMethod || 'online',
      paymentStatus: paymentMethod === 'cod'
        ? 'pending'
        : paymentScreenshot ? 'screenshot_submitted' : 'pending',
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

// @GET /api/orders/my
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/orders/:id
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