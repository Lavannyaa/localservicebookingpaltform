const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateUser } = require('../middleware/authMiddleware');

router.use(authenticateUser);

/**
 * Update authenticated user profile / preferred language
 * PUT /api/users/profile
 */
router.put('/profile', async (req, res, next) => {
  try {
    const { name, phone, preferredLanguage, profileImage } = req.body;
    const updates = {};

    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
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

module.exports = router;
