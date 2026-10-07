const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Provider = require('../models/Provider');

/**
 * Submit a review for a completed service booking
 * POST /api/reviews
 */
const createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, review } = req.body;

    if (!bookingId || !rating || !review) {
      return res.status(422).json({
        success: false,
        message: 'Booking ID, rating (1-5), and review text are required.',
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found.',
      });
    }

    // Must be completed service
    if (booking.status !== 'SERVICE_COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Only completed services can be reviewed.',
      });
    }

    // Check if review already exists
    const existing = await Review.findOne({ bookingId: booking._id });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A review has already been submitted for this booking.',
      });
    }

    const newReview = await Review.create({
      bookingId: booking._id,
      customerId: req.user._id,
      customerName: req.user.name,
      providerId: booking.providerId,
      technicianId: booking.technicianId,
      serviceId: booking.serviceId,
      rating: Number(rating),
      review: review.trim(),
    });

    // Automatically recalculate provider average rating and review count
    if (booking.providerId) {
      const providerReviews = await Review.find({ providerId: booking.providerId });
      const totalRatings = providerReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = (totalRatings / providerReviews.length).toFixed(1);

      await Provider.findByIdAndUpdate(booking.providerId, {
        rating: Number(avgRating),
        reviewCount: providerReviews.length,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. Thank you for your feedback!',
      data: newReview,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get reviews with optional providerId filter
 * GET /api/reviews
 */
const getReviews = async (req, res, next) => {
  try {
    const { providerId, serviceId } = req.query;
    const filter = {};

    if (providerId) filter.providerId = providerId;
    if (serviceId) filter.serviceId = serviceId;

    const reviews = await Review.find(filter)
      .populate('providerId', 'shopName providerName')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReview,
  getReviews,
};
