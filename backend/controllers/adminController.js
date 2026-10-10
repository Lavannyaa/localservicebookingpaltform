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
const { isProviderEligible } = require('../utils/providerEligibility');

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

/**
 * Get eligible providers for a booking based on requested service & location
 * GET /api/admin/bookings/:id/eligible-providers
 */
const getEligibleProvidersForBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({
      $or: [{ bookingNumber: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    const service = await Service.findOne({
      $or: [{ _id: booking.serviceId }, { name: booking.serviceName }],
    });

    const mockServiceObj = service || {
      _id: booking.serviceId,
      name: booking.serviceName,
      category: booking.category,
    };

    const allProviders = await Provider.find().populate('servicesOffered');
    const eligibleProviders = allProviders.filter((p) => isProviderEligible(p, mockServiceObj));

    res.status(200).json({
      success: true,
      count: eligibleProviders.length,
      data: eligibleProviders,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Assign an eligible provider shop to a booking
 * PUT /api/admin/bookings/:id/assign-provider
 */
const assignProviderToBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { providerId } = req.body;

    if (!providerId) {
      return res.status(422).json({
        success: false,
        message: 'Provider ID is required.',
      });
    }

    const booking = await Booking.findOne({
      $or: [{ bookingNumber: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    const provider = await Provider.findOne({
      $or: [{ providerId }, ...(providerId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: providerId }] : [])],
    }).populate('servicesOffered');

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Selected provider shop not found.',
      });
    }

    const service = await Service.findOne({
      $or: [{ _id: booking.serviceId }, { name: booking.serviceName }],
    });

    const mockServiceObj = service || {
      _id: booking.serviceId,
      name: booking.serviceName,
      category: booking.category,
    };

    // Strict Validation: Prevent assignment to providers who do not offer the requested service
    if (!isProviderEligible(provider, mockServiceObj)) {
      return res.status(422).json({
        success: false,
        message: `Assignment rejected: Workshop "${provider.shopName}" does not offer ${booking.category} (${booking.serviceName}) services. Please select an eligible provider.`,
      });
    }

    booking.providerId = provider._id;
    booking.shopName = provider.shopName;
    if (booking.status === 'PENDING') {
      booking.status = 'ACCEPTED';
    }
    booking.statusHistory.push({
      status: booking.status,
      timestamp: new Date(),
      notes: `Provider assigned by Admin: ${provider.shopName}`,
    });

    await booking.save();

    // Notify Provider Account
    if (provider.userId) {
      const Notification = require('../models/Notification');
      await Notification.create({
        recipientUserId: provider.userId,
        recipientRole: 'PROVIDER',
        type: 'BOOKING_REQUESTED',
        title: 'Booking Assigned by Admin',
        message: `Admin assigned booking #${booking.bookingNumber} (${booking.serviceName}) to your workshop.`,
        bookingId: booking._id,
      });
    }

    res.status(200).json({
      success: true,
      message: `Workshop "${provider.shopName}" assigned to booking #${booking.bookingNumber} successfully.`,
      data: booking,
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
  getEligibleProvidersForBooking,
  assignProviderToBooking,
};
