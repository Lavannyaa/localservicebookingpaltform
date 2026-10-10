const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateUser } = require('../middleware/authMiddleware');
const {
  getSettings,
  updateSettings,
  changePassword,
  getProfile,
} = require('../controllers/settingsController');

// All user routes require authentication
router.use(authenticateUser);

/**
 * GET  /api/users/profile  — Return authenticated user's live profile
 * PUT  /api/users/profile  — Update core profile fields (name, phone, language)
 */
router.get('/profile', getProfile);

router.put('/profile', async (req, res, next) => {
  try {
    const { name, phone, preferredLanguage, profileImage } = req.body;
    const updates = {};

    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = String(phone).trim();
    if (preferredLanguage) updates.preferredLanguage = preferredLanguage;
    if (profileImage !== undefined) updates.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-passwordHash');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: user,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/users/settings  — Fetch all 8 settings sections from MongoDB
 * PUT /api/users/settings  — Persist partial/full settings to MongoDB
 */
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

/**
 * POST /api/users/change-password  — Authenticated password change
 */
router.post('/change-password', changePassword);

module.exports = router;

