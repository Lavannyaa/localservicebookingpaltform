const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

// Optional auth middleware so both guests and logged-in users can use chatbot
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (decoded && decoded.userId) {
      req.user = await User.findById(decoded.userId);
    }
  }
  next();
};

router.post('/message', optionalAuth, chatbotController.handleMessage);

module.exports = router;
