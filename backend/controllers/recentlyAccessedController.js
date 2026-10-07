const RecentlyAccessed = require('../models/RecentlyAccessed');

/**
 * Get recently accessed items for authenticated user
 * GET /api/recently-accessed
 */
const getRecentlyAccessed = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = { userId: req.user._id };

    if (type && type !== 'ALL') {
      filter.itemType = { $regex: new RegExp(`^${type.trim()}$`, 'i') };
    }

    const items = await RecentlyAccessed.find(filter)
      .sort({ accessedAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Record a newly accessed item for authenticated user
 * POST /api/recently-accessed
 */
const recordAccess = async (req, res, next) => {
  try {
    const { itemType, itemId, title, subtitle, path, badge, price, rating } = req.body;

    if (!itemType || !itemId || !title) {
      return res.status(422).json({
        success: false,
        message: 'Item type, item ID, and title are required.',
      });
    }

    // Upsert / update timestamp if already recorded
    const record = await RecentlyAccessed.findOneAndUpdate(
      {
        userId: req.user._id,
        itemType,
        itemId,
      },
      {
        title,
        subtitle: subtitle || '',
        path: path || '',
        badge: badge || '',
        price: price ? Number(price) : null,
        rating: rating ? Number(rating) : null,
        accessedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Recently accessed record updated.',
      data: record,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Remove an item from recently accessed
 * DELETE /api/recently-accessed/:id
 */
const removeRecentlyAccessed = async (req, res, next) => {
  try {
    const { id } = req.params;

    await RecentlyAccessed.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from recently accessed list.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Clear all recently accessed items for current user
 * DELETE /api/recently-accessed
 */
const clearRecentlyAccessed = async (req, res, next) => {
  try {
    await RecentlyAccessed.deleteMany({ userId: req.user._id });

    res.status(200).json({
      success: true,
      message: 'Recently accessed history cleared.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRecentlyAccessed,
  recordAccess,
  removeRecentlyAccessed,
  clearRecentlyAccessed,
};
