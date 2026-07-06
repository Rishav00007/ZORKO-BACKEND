// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/authMiddleware');
// const { admin } = require('../middleware/adminMiddleware');
// const { uploadMenu } = require('../config/cloudinary');
// const {
//   getAllItems, createItem, updateItem, deleteItem,
//   getCategories, createCategory, deleteCategory,
//   getAllOrders, updateOrderStatus,
// } = require('../controllers/adminController');

// router.use(protect, admin); // All admin routes are protected

// router.get('/items', getAllItems);
// router.post('/items', uploadMenu.single('image'), createItem);
// router.put('/items/:id', uploadMenu.single('image'), updateItem);
// router.delete('/items/:id', deleteItem);

// router.get('/categories', getCategories);
// //router.post('/categories', createCategory);
// router.post('/categories', uploadMenu.single('image'), createCategory); // added multer
// router.delete('/categories/:id', deleteCategory);

// router.get('/orders', getAllOrders);
// router.put('/orders/:id/status', updateOrderStatus);

// module.exports = router;



const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { uploadMenu } = require('../config/cloudinary');
const {
  getAllItems, createItem, updateItem, deleteItem,
  getCategories, createCategory, deleteCategory,
  getAllOrders, updateOrderStatus,
  getStats,
  getAllReviews, deleteReview, resetItemRatings,
  getCoupons, createCoupon, deleteCoupon,
  updateSettings,
} = require('../controllers/adminController');

router.use(protect, admin);

router.get('/items', getAllItems);
router.post('/items', uploadMenu.single('image'), createItem);
router.put('/items/:id', uploadMenu.single('image'), updateItem);
router.delete('/items/:id', deleteItem);

router.get('/categories', getCategories);
router.post('/categories', uploadMenu.single('image'), createCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.get('/stats', getStats);                         // ✅ NEW

router.get('/reviews', getAllReviews);                  // ✅ NEW
router.delete('/reviews/:id', deleteReview);            // ✅ NEW
router.delete('/reviews/reset/:itemId', resetItemRatings); // ✅ NEW

router.get('/coupons', getCoupons);                     // ✅ NEW
router.post('/coupons', createCoupon);                  // ✅ NEW
router.delete('/coupons/:id', deleteCoupon);            // ✅ NEW

router.put('/settings', updateSettings);                // ✅ NEW

module.exports = router;