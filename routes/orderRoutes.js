// const express = require('express');
// const router = express.Router();
// const { placeOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
// const { protect } = require('../middleware/authMiddleware');
// const { uploadPayment } = require('../config/cloudinary');

// // placeOrder accepts multipart form (for screenshot upload)
// //router.post('/', protect, uploadPayment.single('paymentScreenshot'), placeOrder);
// router.post('/', uploadPayment.single('paymentScreenshot'), placeOrder);
// router.get('/my', protect, getMyOrders);
// router.get('/:id', protect, getOrderById);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById } = require('../controllers/orderController');
const { protect, optionalProtect } = require('../middleware/authMiddleware'); // ✅ import optionalProtect
const { uploadPayment } = require('../config/cloudinary');

// ✅ optionalProtect — works for both guests and logged-in users
router.post('/', optionalProtect, uploadPayment.single('paymentScreenshot'), placeOrder);

router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;