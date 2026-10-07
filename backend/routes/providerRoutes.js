const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public Provider Discovery Routes
router.get('/', providerController.getProviders);

// Protected Provider Operations (Must precede /:id)
router.get(
  '/technicians',
  authenticateUser,
  authorizeRoles('PROVIDER', 'ADMIN'),
  providerController.getProviderTechnicians
);
router.get(
  '/bookings',
  authenticateUser,
  authorizeRoles('PROVIDER', 'ADMIN'),
  providerController.getProviderBookings
);
router.put(
  '/bookings/:id/accept',
  authenticateUser,
  authorizeRoles('PROVIDER', 'ADMIN'),
  providerController.acceptBooking
);
router.put(
  '/bookings/:id/reject',
  authenticateUser,
  authorizeRoles('PROVIDER', 'ADMIN'),
  providerController.rejectBooking
);
router.put(
  '/bookings/:id/assign-technician',
  authenticateUser,
  authorizeRoles('PROVIDER', 'ADMIN'),
  providerController.assignTechnician
);

// Parameterized Provider Routes
router.get('/:id', providerController.getProviderById);
router.get('/:id/services', providerController.getProviderServices);
router.get('/:id/reviews', providerController.getProviderReviews);

module.exports = router;
