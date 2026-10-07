const express = require('express');
const router = express.Router();
const passportController = require('../controllers/passportController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.use(authenticateUser);

router.get('/', passportController.getServicePassports);
router.get('/:id', passportController.getServicePassportById);

module.exports = router;
