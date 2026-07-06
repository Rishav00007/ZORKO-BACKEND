const express = require('express');
const router = express.Router();
const { validateCoupon } = require('../controllers/couponController');

router.post('/validate', validateCoupon); // public

module.exports = router;