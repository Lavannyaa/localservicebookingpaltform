const Notification = require('../models/Notification');

/**
 * Get notifications for authenticated user
 * GET /api/notifications
 */
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { recipientUserId: req.user._id },
        { recipientRole: req.user.role },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      $or: [
        { recipientUserId: req.user._id },
        { recipientRole: req.user.role },
      ],
      isRead: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Mark a single notification as read
 * PUT /api/notifications/:id/read
 */
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notif = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notif) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      data: notif,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Mark all notifications as read for current user
 * PUT /api/notifications/read-all
 */
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      {
        $or: [
          { recipientUserId: req.user._id },
          { recipientRole: req.user.role },
        ],
        isRead: false,
      },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
