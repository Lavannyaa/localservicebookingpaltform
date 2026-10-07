const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.use(authenticateUser);

router.get('/', maintenanceController.getMaintenanceSchedules);
router.post('/', maintenanceController.createMaintenance);
router.put('/:id', maintenanceController.updateMaintenance);
router.get('/:id/book-again', maintenanceController.getBookAgainDetails);

module.exports = router;
