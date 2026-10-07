const Technician = require('../models/Technician');
const Booking = require('../models/Booking');
const Checklist = require('../models/Checklist');
const ServicePassport = require('../models/ServicePassport');
const Maintenance = require('../models/Maintenance');
const Notification = require('../models/Notification');
const { getIO } = require('../sockets/socketHandler');

/**
 * Get technician profile
 * GET /api/technicians/profile
 */
const getTechnicianProfile = async (req, res, next) => {
  try {
    const technician = await Technician.findOne({ userId: req.user._id }).populate('providerId');

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician profile not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: technician,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get assigned jobs for technician
 * GET /api/technicians/jobs
 */
const getTechnicianJobs = async (req, res, next) => {
  try {
    const technician = await Technician.findOne({ userId: req.user._id });

    if (!technician && req.user.role !== 'ADMIN') {
      return res.status(404).json({
        success: false,
        message: 'No technician record associated with this account.',
      });
    }

    const filter = req.user.role === 'ADMIN' && req.query.technicianId
      ? { technicianId: req.query.technicianId }
      : { technicianId: technician._id };

    const { status } = req.query;
    if (status && status !== 'ALL') {
      filter.status = status.toUpperCase();
    }

    const jobs = await Booking.find(filter)
      .populate('customerId', 'name email phone')
      .populate('providerId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single job by ID
 * GET /api/technicians/jobs/:id
 */
const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await Booking.findOne({
      $or: [{ bookingNumber: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
    })
      .populate('customerId', 'name email phone')
      .populate('providerId')
      .populate('technicianId');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job work order not found.',
      });
    }

    const checklist = await Checklist.findOne({ bookingId: job._id });

    res.status(200).json({
      success: true,
      data: {
        ...job.toObject(),
        checklist: checklist ? checklist.items : [],
        checklistProgress: checklist ? checklist.completionPercentage : 0,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Technician accepts assigned job
 * PUT /api/technicians/jobs/:id/accept
 */
const acceptJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Booking.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job work order not found.',
      });
    }

    job.status = 'TECHNICIAN_ACCEPTED';
    job.statusHistory.push({
      status: 'TECHNICIAN_ACCEPTED',
      timestamp: new Date(),
      notes: 'Technician confirmed dispatch schedule and accepted work order.',
    });

    await job.save();

    // Notify Customer
    await Notification.create({
      recipientUserId: job.customerId,
      recipientRole: 'CUSTOMER',
      type: 'BOOKING_ACCEPTED',
      title: 'Technician Confirmed Schedule',
      message: `${job.technicianName || 'The technician'} has accepted and confirmed your service order #${job.bookingNumber}.`,
      bookingId: job._id,
    });

    // Socket.IO
    const io = getIO();
    if (io) {
      io.to(`booking_${job._id}`).emit('technician:accepted', {
        bookingId: job._id,
        status: 'TECHNICIAN_ACCEPTED',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job accepted. You are scheduled for field execution.',
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Technician advances status (ON_THE_WAY, ARRIVED, SERVICE_STARTED)
 * PUT /api/technicians/jobs/:id/status
 */
const updateJobStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['ON_THE_WAY', 'ARRIVED', 'SERVICE_STARTED'];
    const targetStatus = (status || '').toUpperCase();

    if (!validStatuses.includes(targetStatus)) {
      return res.status(422).json({
        success: false,
        message: `Invalid status transition. Permitted: [${validStatuses.join(', ')}]. Use /complete endpoint to finalize.`,
      });
    }

    const job = await Booking.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job work order not found.',
      });
    }

    job.status = targetStatus;
    job.statusHistory.push({
      status: targetStatus,
      timestamp: new Date(),
      notes: notes || `Technician marked job as ${targetStatus}`,
    });

    await job.save();

    // Determine notification message & socket event
    let notifType = 'SYSTEM';
    let notifTitle = 'Service Status Updated';
    let notifMsg = `Job #${job.bookingNumber} is now ${targetStatus}`;
    let socketEvent = 'service:updated';

    if (targetStatus === 'ON_THE_WAY') {
      notifType = 'TECHNICIAN_ON_THE_WAY';
      notifTitle = 'Technician is On The Way';
      notifMsg = `${job.technicianName} is en route to your service address.`;
      socketEvent = 'technician:onTheWay';
    } else if (targetStatus === 'ARRIVED') {
      notifType = 'TECHNICIAN_ARRIVED';
      notifTitle = 'Technician Arrived at Site';
      notifMsg = `${job.technicianName} has arrived at your premises.`;
      socketEvent = 'technician:arrived';
    } else if (targetStatus === 'SERVICE_STARTED') {
      notifType = 'SERVICE_STARTED';
      notifTitle = 'Service In Progress';
      notifMsg = `Execution of ${job.serviceName} has officially commenced.`;
      socketEvent = 'service:started';
    }

    await Notification.create({
      recipientUserId: job.customerId,
      recipientRole: 'CUSTOMER',
      type: notifType,
      title: notifTitle,
      message: notifMsg,
      bookingId: job._id,
    });

    const io = getIO();
    if (io) {
      io.to(`booking_${job._id}`).emit(socketEvent, {
        bookingId: job._id,
        status: targetStatus,
      });
    }

    res.status(200).json({
      success: true,
      message: `Job status progressed to ${targetStatus}.`,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Technician updates checklist item status
 * PUT /api/technicians/jobs/:id/checklist
 */
const updateChecklist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { itemId, completed, notes } = req.body;

    let checklist = await Checklist.findOne({ bookingId: id });
    if (!checklist) {
      return res.status(404).json({
        success: false,
        message: 'Checklist for this booking does not exist.',
      });
    }

    const item = checklist.items.find((i) => i.id === itemId || i._id?.toString() === itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Checklist item not found.',
      });
    }

    item.completed = Boolean(completed);
    if (completed) item.completedAt = new Date();
    if (notes !== undefined) item.notes = notes;

    // Recalculate percentage
    const completedCount = checklist.items.filter((i) => i.completed).length;
    checklist.completionPercentage = Math.round(
      (completedCount / checklist.items.length) * 100
    );

    await checklist.save();

    // Update booking's progress tracker
    await Booking.findByIdAndUpdate(id, {
      checklistProgress: checklist.completionPercentage,
    });

    res.status(200).json({
      success: true,
      message: 'Checklist item updated.',
      data: {
        items: checklist.items,
        completionPercentage: checklist.completionPercentage,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Technician saves service notes
 * PUT /api/technicians/jobs/:id/notes
 */
const updateNotes = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { issuesFound, workPerformed, partsReplaced, recommendations } = req.body;

    const job = await Booking.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job work order not found.',
      });
    }

    job.technicianNotes = {
      issuesFound: issuesFound || job.technicianNotes?.issuesFound || '',
      workPerformed: workPerformed || job.technicianNotes?.workPerformed || '',
      partsReplaced: partsReplaced || job.technicianNotes?.partsReplaced || [],
      recommendations: recommendations || job.technicianNotes?.recommendations || '',
    };

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Technician notes saved.',
      data: job.technicianNotes,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Technician completes service
 * Core Unique Feature Trigger:
 * Finalizes job -> Updates Service Passport -> Schedules Next Maintenance -> Enables "Book Again"
 * PUT /api/technicians/jobs/:id/complete
 */
const completeJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { issuesFound, workPerformed, partsReplaced, recommendations, amountPaid } = req.body;

    const job = await Booking.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job work order not found.',
      });
    }

    job.status = 'SERVICE_COMPLETED';
    job.completedAt = new Date();
    job.paymentStatus = 'PAID';
    if (amountPaid) job.totalAmount = Number(amountPaid);

    // Save final technician notes
    job.technicianNotes = {
      issuesFound: issuesFound || job.technicianNotes?.issuesFound || 'Regular wear and maintenance inspection.',
      workPerformed: workPerformed || job.technicianNotes?.workPerformed || 'Standardized trade service execution per SOP checklist.',
      partsReplaced: partsReplaced || job.technicianNotes?.partsReplaced || [],
      recommendations: recommendations || job.technicianNotes?.recommendations || 'Recommended follow-up maintenance in 3 months.',
    };

    job.statusHistory.push({
      status: 'SERVICE_COMPLETED',
      timestamp: new Date(),
      notes: 'Service successfully completed and verified with digital sign-off.',
    });

    await job.save();

    // 1. Fetch Checklist snapshot
    const checklist = await Checklist.findOne({ bookingId: job._id });
    const checklistSnapshot = checklist
      ? checklist.items.map((i) => ({ task: i.task, completed: i.completed }))
      : [];

    // Calculate Next Maintenance Date (Default: 3 months from now)
    const nextMaintDate = new Date();
    nextMaintDate.setMonth(nextMaintDate.getMonth() + 3);

    // 2. Core Feature: Update or Create Customer Service Passport
    let passport = await ServicePassport.findOne({
      customerId: job.customerId,
      applianceOrServiceName: job.serviceName,
    });

    const passportRecord = {
      bookingId: job._id,
      bookingNumber: job.bookingNumber,
      serviceDate: new Date(),
      providerName: job.shopName || 'FrostTech AC & Electrical Solutions',
      shopName: job.shopName || 'FrostTech AC & Electrical Solutions',
      technicianName: job.technicianName || 'Certified Technician',
      workCompleted: job.technicianNotes.workPerformed,
      partsReplaced: job.technicianNotes.partsReplaced,
      checklistSnapshot,
      notes: job.technicianNotes.issuesFound,
      recommendations: job.technicianNotes.recommendations,
      amountPaid: job.totalAmount,
      warrantyMonths: 3,
      nextMaintenanceDate: nextMaintDate,
      completionStatus: 'VERIFIED_COMPLETED',
    };

    if (!passport) {
      passport = await ServicePassport.create({
        passportNumber: `PASSPORT-TNV-${Date.now().toString().slice(-6)}`,
        customerId: job.customerId,
        applianceOrServiceName: job.serviceName,
        serviceHistory: [passportRecord],
        totalServicesDone: 1,
      });
    } else {
      passport.serviceHistory.push(passportRecord);
      passport.totalServicesDone += 1;
      await passport.save();
    }

    // 3. Core Feature: Schedule Maintenance Reminder
    await Maintenance.create({
      customerId: job.customerId,
      servicePassportId: passport._id,
      serviceId: job.serviceId,
      serviceName: job.serviceName,
      applianceName: job.serviceName,
      lastServiceDate: new Date(),
      nextMaintenanceDate: nextMaintDate,
      intervalMonths: 3,
      reminderStatus: 'UPCOMING',
      reminderSent: false,
      canBookAgain: true,
      lastBookingId: job._id,
      preferredProviderId: job.providerId,
    });

    // 4. Notify Customer
    await Notification.create({
      recipientUserId: job.customerId,
      recipientRole: 'CUSTOMER',
      type: 'SERVICE_COMPLETED',
      title: 'Service Completed & Passport Updated',
      message: `Service #${job.bookingNumber} (${job.serviceName}) has been completed. Your digital Service Passport has been updated with a 3-month warranty!`,
      bookingId: job._id,
      data: {
        passportId: passport._id,
        nextMaintenanceDate: nextMaintDate,
      },
    });

    // 5. Socket.IO emission
    const io = getIO();
    if (io) {
      io.to(`booking_${job._id}`).emit('service:completed', {
        bookingId: job._id,
        status: 'SERVICE_COMPLETED',
        passportNumber: passport.passportNumber,
        nextMaintenanceDate: nextMaintDate,
      });
    }

    res.status(200).json({
      success: true,
      message:
        'Job successfully marked complete. Digital Service Passport updated and next maintenance scheduled.',
      data: {
        job,
        passport,
        nextMaintenanceDate: nextMaintDate,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTechnicianProfile,
  getTechnicianJobs,
  getJobById,
  acceptJob,
  updateJobStatus,
  updateChecklist,
  updateNotes,
  completeJob,
};
