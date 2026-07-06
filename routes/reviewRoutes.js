// const express = require('express');
// const router = express.Router();
// const { addReview, getItemReviews } = require('../controllers/reviewController');
// const { protect } = require('../middleware/authMiddleware');

// router.post('/:itemId', protect, addReview);  // must be logged in to review
// router.get('/:itemId', getItemReviews);        // anyone can see reviews

// module.exports = router;



const express = require('express');
const router = express.Router();
const { addReview, getItemReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:itemId', protect, addReview);
router.get('/:itemId', getItemReviews);

module.exports = router;