const express = require('express');
const router = express.Router();
const recentlyAccessedController = require('../controllers/recentlyAccessedController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.use(authenticateUser);

router.get('/', recentlyAccessedController.getRecentlyAccessed);
router.post('/', recentlyAccessedController.recordAccess);
router.delete('/:id', recentlyAccessedController.removeRecentlyAccessed);
router.delete('/', recentlyAccessedController.clearRecentlyAccessed);

module.exports = router;
