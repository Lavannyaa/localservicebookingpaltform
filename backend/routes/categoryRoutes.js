const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// GET /api/categories
router.get('/', serviceController.getCategories);

module.exports = router;
