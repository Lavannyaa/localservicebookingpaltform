const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Provider = require('../models/Provider');
const Checklist = require('../models/Checklist');
const Notification = require('../models/Notification');
const { getIO } = require('../sockets/socketHandler');

/**
 * Create a new service booking
 * POST /api/bookings
 */
const createBooking = async (req, res, next) => {
  try {
    const {
      serviceId,
      providerId,
      bookingDate,
      bookingTime,
      serviceAddress,
      city,
      customerName,
      customerPhone,
      problemDescription,
      isMaintenanceRebooking,
      paymentMethod,
    } = req.body;

    if (!serviceId || !bookingDate || !bookingTime || !serviceAddress) {
      return res.status(422).json({
        success: false,
        message: 'Service, date, time slot, and delivery address are required.',
      });
    }

    const service = await Service.findOne({
      $or: [{ serviceId }, ...(serviceId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: serviceId }] : [])],
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Selected service not found in catalogue.',
      });
    }

    let provider = null;
    if (providerId) {
      provider = await Provider.findOne({
        $or: [{ providerId }, ...(providerId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: providerId }] : [])],
      });
    }

    const bookingNumber = `BK-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newBooking = await Booking.create({
      bookingNumber,
      customerId: req.user._id,
      customerName: customerName || req.user.name,
      customerPhone: customerPhone || req.user.phone || '+91 98401 23456',
      customerEmail: req.user.email,
      providerId: provider ? provider._id : null,
      shopName: provider ? provider.shopName : 'FrostTech AC & Electrical Solutions',
      serviceId: service._id,
      serviceName: service.name,
      category: service.category,
      bookingDate,
      bookingTime,
      serviceAddress,
      city: city || 'Tirunelveli',
      problemDescription: problemDescription || '',
      status: 'PENDING',
      totalAmount: service.startingPrice,
      paymentStatus: paymentMethod === 'Online' ? 'PAID' : 'PENDING',
      isMaintenanceRebooking: Boolean(isMaintenanceRebooking),
      statusHistory: [
        {
          status: 'PENDING',
          timestamp: new Date(),
          notes: isMaintenanceRebooking
            ? 'Booking created via 1-Click Maintenance Rebooking'
            : 'Booking placed by customer',
        },
      ],
    });

    // Initialize Default Checklist for this booking
    const checklistItems = (service.defaultChecklist && service.defaultChecklist.length > 0
      ? service.defaultChecklist
      : [
          'Pre-service inspection and safety check',
          'Primary fault diagnosis and component testing',
          'Execution of repair, servicing, and cleaning',
          'Post-service cooling / functional test run',
          'Customer demonstration and job clearance',
        ]
    ).map((task, idx) => ({
      id: `chk_${idx + 1}`,
      task,
      completed: false,
    }));

    await Checklist.create({
      bookingId: newBooking._id,
      items: checklistItems,
      completionPercentage: 0,
    });

    // Notify Customer
    await Notification.create({
      recipientUserId: req.user._id,
      recipientRole: 'CUSTOMER',
      type: 'BOOKING_REQUESTED',
      title: 'Booking Requested Successfully',
      message: `Your booking #${bookingNumber} for ${service.name} has been placed. Waiting for workshop confirmation.`,
      bookingId: newBooking._id,
    });

    // If assigned provider exists, notify provider user
    if (provider && provider.userId) {
      await Notification.create({
        recipientUserId: provider.userId,
        recipientRole: 'PROVIDER',
        type: 'BOOKING_REQUESTED',
        title: 'New Service Booking Request',
        message: `New request #${bookingNumber} for ${service.name} from ${newBooking.customerName}.`,
        bookingId: newBooking._id,
      });
    }

    // Socket.IO emission to room
    const io = getIO();
    if (io) {
      io.emit('booking:created', {
        bookingId: newBooking._id,
        bookingNumber: newBooking.bookingNumber,
        serviceName: newBooking.serviceName,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully. Workshop assignment in progress.',
      data: newBooking,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get bookings for the authenticated customer or filtered for admin
 * GET /api/bookings
 */
const getBookings = async (req, res, next) => {
  try {
    const filter = {};

    // Customer can only view their own bookings
    if (req.user.role === 'CUSTOMER') {
      filter.customerId = req.user._id;
    } else if (req.user.role === 'PROVIDER') {
      const provider = await Provider.findOne({ userId: req.user._id });
      if (provider) filter.providerId = provider._id;
    }

    const { status, search } = req.query;
    if (status && status !== 'ALL') {
      filter.status = status.toUpperCase();
    }

    if (search && search.trim()) {
      filter.$or = [
        { bookingNumber: { $regex: search.trim(), $options: 'i' } },
        { serviceName: { $regex: search.trim(), $options: 'i' } },
        { customerName: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const bookings = await Booking.find(filter)
      .populate('providerId')
      .populate('technicianId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get booking by ID with checklist details
 * GET /api/bookings/:id
 */
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findOne({
      $or: [{ bookingNumber: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
    })
      .populate('providerId')
      .populate('technicianId')
      .populate('customerId', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Role safety check: Customer can only view their own booking
    if (
      req.user.role === 'CUSTOMER' &&
      booking.customerId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own bookings.',
      });
    }

    const checklist = await Checklist.findOne({ bookingId: booking._id });

    res.status(200).json({
      success: true,
      data: {
        ...booking.toObject(),
        checklist: checklist ? checklist.items : [],
        checklistProgress: checklist ? checklist.completionPercentage : 0,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Customer cancels booking
 * PUT /api/bookings/:id/cancel
 */
const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    if (
      req.user.role === 'CUSTOMER' &&
      booking.customerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only cancel your own bookings.',
      });
    }

    if (['SERVICE_STARTED', 'SERVICE_COMPLETED'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a service that has already commenced or completed.',
      });
    }

    booking.status = 'CANCELLED';
    booking.statusHistory.push({
      status: 'CANCELLED',
      timestamp: new Date(),
      notes: reason || 'Booking cancelled by customer',
    });

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking has been successfully cancelled.',
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * 1-Click "Book Again" from completed service / maintenance reminder
 * POST /api/bookings/:id/rebook
 */
const rebookBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { preferredDate, preferredTime } = req.body || {};

    const prevBooking = await Booking.findOne({
      $or: [{ bookingNumber: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
    });

    if (!prevBooking) {
      return res.status(404).json({
        success: false,
        message: 'Previous booking record not found to rebook.',
      });
    }

    const nextDate = preferredDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
    const nextTime = preferredTime || prevBooking.bookingTime || '10:00 AM - 12:00 PM';
    const newBookingNumber = `BK-RE-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newBooking = await Booking.create({
      bookingNumber: newBookingNumber,
      customerId: req.user._id,
      customerName: prevBooking.customerName || req.user.name,
      customerPhone: prevBooking.customerPhone || req.user.phone || '+91 98401 23456',
      customerEmail: prevBooking.customerEmail || req.user.email,
      serviceId: prevBooking.serviceId,
      serviceName: prevBooking.serviceName,
      category: prevBooking.category,
      providerId: prevBooking.providerId,
      bookingDate: nextDate,
      bookingTime: nextTime,
      serviceAddress: prevBooking.serviceAddress,
      city: prevBooking.city || 'Tirunelveli',
      problemDescription: `Recurring preventive maintenance re-booking for ${prevBooking.serviceName}`,
      isMaintenanceRebooking: true,
      status: 'PENDING',
      statusHistory: [
        {
          status: 'PENDING',
          timestamp: new Date(),
          notes: `1-Click Maintenance Re-Booking from #${prevBooking.bookingNumber}`,
        },
      ],
      totalAmount: prevBooking.totalAmount,
      paymentStatus: 'PENDING',
      checklistProgress: 0,
    });

    // Create fresh checklist
    const prevChecklist = await Checklist.findOne({ bookingId: prevBooking._id });
    if (prevChecklist && prevChecklist.items.length > 0) {
      await Checklist.create({
        bookingId: newBooking._id,
        items: prevChecklist.items.map((it, idx) => ({
          id: it.id || `chk-${idx + 1}`,
          task: it.task,
          completed: false,
        })),
        completionPercentage: 0,
      });
    }

    res.status(201).json({
      success: true,
      message: `1-Click Re-Booking successful! New booking created: #${newBooking.bookingNumber}`,
      data: newBooking,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  rebookBooking,
};
