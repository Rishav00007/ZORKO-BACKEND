const Review = require('../models/Review');
const MenuItem = require('../models/MenuItem');

// @POST /api/reviews/:itemId
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const menuItemId = req.params.itemId;

    const existing = await Review.findOne({ menuItem: menuItemId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this item' });

    const review = await Review.create({
      menuItem: menuItemId,
      user: req.user._id,
      rating: Number(rating),
      comment,
      customerName: req.user.name,
    });

    // Update average rating on the menu item
    const reviews = await Review.find({ menuItem: menuItemId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await MenuItem.findByIdAndUpdate(menuItemId, {
      averageRating: Number(avgRating.toFixed(1)),
      numReviews: reviews.length,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/reviews/:itemId
const getItemReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ menuItem: req.params.itemId })
      .sort('-createdAt')
      .limit(10);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview, getItemReviews };