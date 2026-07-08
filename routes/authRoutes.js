// const express = require('express');
// const router = express.Router();
// const { register, login, getMe } = require('../controllers/authController');
// const { protect } = require('../middleware/authMiddleware');

// router.post('/register', register);
// router.post('/login', login);
// router.get('/me', protect, getMe);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { register, login, getMe, forgotPassword, verifyOtpAndReset } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);   // ✅ NEW
router.post('/verify-otp', verifyOtpAndReset);     // ✅ NEW

module.exports = router;