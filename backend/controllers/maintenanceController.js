const Maintenance = require('../models/Maintenance');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

/**
 * Get maintenance schedules for the authenticated customer
 * GET /api/maintenance
 */
const getMaintenanceSchedules = async (req, res, next) => {
  try {
    const filter = req.user.role === 'ADMIN' && req.query.customerId
      ? { customerId: req.query.customerId }
      : { customerId: req.user._id };

    const schedules = await Maintenance.find(filter)
      .populate('servicePassportId')
      .populate('preferredProviderId')
      .sort({ nextMaintenanceDate: 1 });

    // Mark items DUE or OVERDUE dynamically based on current date
    const now = new Date();
    const updatedSchedules = schedules.map((s) => {
      const obj = s.toObject();
      const nextDate = new Date(s.nextMaintenanceDate);
      const diffDays = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        obj.reminderStatus = 'OVERDUE';
      } else if (diffDays <= 14) {
        obj.reminderStatus = 'DUE';
      } else {
        obj.reminderStatus = 'UPCOMING';
      }
      return obj;
    });

    res.status(200).json({
      success: true,
      count: updatedSchedules.length,
      data: updatedSchedules,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new maintenance schedule manually
 * POST /api/maintenance
 */
const createMaintenance = async (req, res, next) => {
  try {
    const {
      serviceName,
      applianceName,
      lastServiceDate,
      intervalMonths = 3,
      servicePassportId,
      preferredProviderId,
    } = req.body;

    if (!serviceName) {
      return res.status(422).json({
        success: false,
        message: 'Service name is required to schedule maintenance.',
      });
    }

    const lastDate = lastServiceDate ? new Date(lastServiceDate) : new Date();
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + Number(intervalMonths));

    const schedule = await Maintenance.create({
      customerId: req.user._id,
      servicePassportId,
      serviceName,
      applianceName: applianceName || serviceName,
      lastServiceDate: lastDate,
      nextMaintenanceDate: nextDate,
      intervalMonths: Number(intervalMonths),
      reminderStatus: 'UPCOMING',
      reminderSent: false,
      canBookAgain: true,
      preferredProviderId,
    });

    res.status(201).json({
      success: true,
      message: 'Preventive maintenance schedule created.',
      data: schedule,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update maintenance schedule
 * PUT /api/maintenance/:id
 */
const updateMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;

    const schedule = await Maintenance.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Maintenance schedule updated.',
      data: schedule,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Book Again pre-filled payload from maintenance record
 * GET /api/maintenance/:id/book-again
 */
const getBookAgainDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const schedule = await Maintenance.findById(id)
      .populate('servicePassportId')
      .populate('preferredProviderId');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance schedule not found.',
      });
    }

    // Find original service in catalogue
    const service = await Service.findOne({
      name: { $regex: new RegExp(schedule.serviceName.trim(), 'i') },
    });

    res.status(200).json({
      success: true,
      data: {
        maintenanceId: schedule._id,
        serviceId: service ? service._id : null,
        serviceName: schedule.serviceName,
        category: service ? service.category : 'AC & Appliances',
        suggestedDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        suggestedTime: '10:00 AM - 12:00 PM',
        preferredProvider: schedule.preferredProviderId,
        estimatedPrice: service ? service.startingPrice : 599,
        isMaintenanceRebooking: true,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMaintenanceSchedules,
  createMaintenance,
  updateMaintenance,
  getBookAgainDetails,
};
