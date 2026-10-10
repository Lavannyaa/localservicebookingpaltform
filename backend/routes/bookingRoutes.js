const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateUser } = require('../middleware/authMiddleware');

// All booking routes require authentication
router.use(authenticateUser);

router.post('/', bookingController.createBooking);
router.get('/', bookingController.getBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id/status', bookingController.updateBookingStatus);
router.post('/:id/rebook', bookingController.rebookBooking);
router.post('/rebook/:id', bookingController.rebookBooking);
router.put('/:id/cancel', bookingController.cancelBooking);

module.exports = router;
