const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticateUser } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public Service Discovery Routes
router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);

// Admin-Protected Service Management
router.post(
  '/',
  authenticateUser,
  authorizeRoles('ADMIN'),
  serviceController.createService
);
router.put(
  '/:id',
  authenticateUser,
  authorizeRoles('ADMIN'),
  serviceController.updateService
);
router.delete(
  '/:id',
  authenticateUser,
  authorizeRoles('ADMIN'),
  serviceController.deleteService
);

module.exports = router;
