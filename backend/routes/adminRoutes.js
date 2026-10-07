const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const bookingController = require('../controllers/bookingController');
const supportController = require('../controllers/supportController');
const reviewController = require('../controllers/reviewController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Strictly Admin Protected
router.use(authenticateUser);
router.use(authorizeRoles('ADMIN'));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id/status', adminController.toggleUserStatus);
router.put('/providers/:id/verify', adminController.verifyProvider);
router.get('/reports', adminController.getReports);

// Admin-level queries across entities
router.get('/bookings', bookingController.getBookings);
router.get('/complaints', supportController.getTickets);
router.get('/reviews', reviewController.getReviews);

module.exports = router;
