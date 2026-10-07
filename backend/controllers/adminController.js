const User = require('../models/User');
const Provider = require('../models/Provider');
const Technician = require('../models/Technician');
const SupportStaff = require('../models/SupportStaff');
const Service = require('../models/Service');
const Category = require('../models/Category');
const Booking = require('../models/Booking');
const Complaint = require('../models/Complaint');
const Review = require('../models/Review');
const Maintenance = require('../models/Maintenance');

/**
 * Get real-time Admin Dashboard statistics directly from MongoDB
 * GET /api/admin/dashboard
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalCustomers,
      totalProviders,
      totalTechnicians,
      totalSupportStaff,
      totalServices,
      totalBookings,
      pendingBookings,
      completedBookings,
      openComplaints,
      totalReviews,
      maintenanceReminders,
    ] = await Promise.all([
      User.countDocuments({ role: 'CUSTOMER' }),
      Provider.countDocuments(),
      Technician.countDocuments(),
      SupportStaff.countDocuments(),
      Service.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: { $in: ['PENDING', 'ACCEPTED', 'TECHNICIAN_ASSIGNED'] } }),
      Booking.countDocuments({ status: 'SERVICE_COMPLETED' }),
      Complaint.countDocuments({ status: { $in: ['OPEN', 'IN_INVESTIGATION'] } }),
      Review.countDocuments(),
      Maintenance.countDocuments({ reminderStatus: { $in: ['UPCOMING', 'DUE'] } }),
    ]);

    // Financial revenue volume
    const revenueAgg = await Booking.aggregate([
      { $match: { status: 'SERVICE_COMPLETED' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const platformRevenue = revenueAgg[0] ? revenueAgg[0].totalRevenue : 0;

    // Recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(6);

    // Recent complaints
    const recentComplaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalCustomers,
          totalProviders,
          totalTechnicians,
          totalSupportStaff,
          totalServices,
          totalBookings,
          pendingBookings,
          completedBookings,
          openComplaints,
          totalReviews,
          maintenanceReminders,
          platformRevenue,
        },
        recentBookings,
        recentComplaints,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all users with role filtering & search
 * GET /api/admin/users
 */
const getUsers = async (req, res, next) => {
  try {
    const { role, status, search } = req.query;
    const filter = {};

    if (role && role !== 'ALL') filter.role = role.toUpperCase();
    if (status && status !== 'ALL') filter.status = status.toUpperCase();
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const users = await User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Toggle user account status (Activate / Deactivate)
 * PUT /api/admin/users/:id/status
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.',
      });
    }

    user.status = status || (user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been set to ${user.status}.`,
      data: { userId: user._id, status: user.status },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Verify or unverify provider workshop
 * PUT /api/admin/providers/:id/verify
 */
const verifyProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    const provider = await Provider.findById(id);
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider workshop not found.',
      });
    }

    provider.verified = verified !== undefined ? Boolean(verified) : !provider.verified;
    await provider.save();

    res.status(200).json({
      success: true,
      message: `Workshop verification status updated to ${provider.verified ? 'Verified' : 'Pending'}.`,
      data: provider,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get comprehensive management reports
 * GET /api/admin/reports
 */
const getReports = async (req, res, next) => {
  try {
    // Bookings by Category
    const bookingsByCategory = await Booking.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalRevenue: { $sum: '$totalAmount' } } },
      { $sort: { count: -1 } },
    ]);

    // Popular Services
    const popularServices = await Booking.aggregate([
      { $group: { _id: '$serviceName', bookingsCount: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { bookingsCount: -1 } },
      { $limit: 6 },
    ]);

    // Provider performance
    const providerPerformance = await Provider.find()
      .select('shopName providerName rating reviewCount city')
      .sort({ rating: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        bookingsByCategory,
        popularServices,
        providerPerformance,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  toggleUserStatus,
  verifyProvider,
  getReports,
};
