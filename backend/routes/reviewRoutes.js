const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.get('/', reviewController.getReviews);
router.post('/', authenticateUser, reviewController.createReview);

module.exports = router;
