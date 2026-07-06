const Coupon = require('../models/Coupon');

// @POST /api/coupons/validate — public
const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ valid: false, message: 'Enter a coupon code' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });
    if (!coupon) return res.status(404).json({ valid: false, message: 'Invalid coupon code' });

    if (coupon.expiresAt && new Date() > coupon.expiresAt)
      return res.status(400).json({ valid: false, message: 'Coupon has expired' });

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses)
      return res.status(400).json({ valid: false, message: 'Coupon usage limit reached' });

    if (Number(subtotal) < coupon.minOrderAmount)
      return res.status(400).json({ valid: false, message: `Minimum order ₹${coupon.minOrderAmount} required` });

    const discount = coupon.discountType === 'percentage'
      ? Math.round(Number(subtotal) * coupon.discountValue / 100)
      : Math.min(coupon.discountValue, Number(subtotal));

    res.json({
      valid: true,
      discountAmount: discount,
      message: `✅ ${coupon.code} applied! You save ₹${discount}`,
    });
  } catch (error) {
    res.status(500).json({ valid: false, message: error.message });
  }
};

module.exports = { validateCoupon };