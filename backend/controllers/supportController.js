const Complaint = require('../models/Complaint');
const SupportStaff = require('../models/SupportStaff');
const Notification = require('../models/Notification');

/**
 * Create a new support ticket / complaint
 * POST /api/support/tickets
 */
const createTicket = async (req, res, next) => {
  try {
    const { issueType, description, priority, bookingId, providerId } = req.body;

    if (!issueType || !description) {
      return res.status(422).json({
        success: false,
        message: 'Issue type and description are required.',
      });
    }

    const complaintNumber = `TKT-${Date.now().toString().slice(-6)}-${Math.floor(10 + Math.random() * 90)}`;

    // Auto-assign to available support staff if any
    const availableStaff = await SupportStaff.findOne({ status: 'ONLINE' });

    const ticket = await Complaint.create({
      complaintNumber,
      customerId: req.user._id,
      customerName: req.user.name,
      issueType,
      description,
      priority: (priority || 'MEDIUM').toUpperCase(),
      status: 'OPEN',
      bookingId: bookingId || null,
      providerId: providerId || null,
      assignedStaffId: availableStaff ? availableStaff._id : null,
      messages: [
        {
          sender: req.user.name,
          senderRole: req.user.role,
          message: description,
          timestamp: new Date(),
        },
      ],
    });

    if (availableStaff) {
      await SupportStaff.findByIdAndUpdate(availableStaff._id, {
        $inc: { assignedTicketsCount: 1 },
      });
    }

    res.status(201).json({
      success: true,
      message: `Support ticket #${complaintNumber} opened successfully. Our team will review shortly.`,
      data: ticket,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get support tickets (filtered for customer or full for support/admin)
 * GET /api/support/tickets
 */
const getTickets = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === 'CUSTOMER') {
      filter.customerId = req.user._id;
    } else if (req.user.role === 'SUPPORT_STAFF') {
      const staff = await SupportStaff.findOne({ userId: req.user._id });
      if (staff && req.query.assignedOnly === 'true') {
        filter.assignedStaffId = staff._id;
      }
    }

    const { status, priority, search } = req.query;
    if (status && status !== 'ALL') filter.status = status.toUpperCase();
    if (priority && priority !== 'ALL') filter.priority = priority.toUpperCase();

    if (search && search.trim()) {
      filter.$or = [
        { complaintNumber: { $regex: search.trim(), $options: 'i' } },
        { issueType: { $regex: search.trim(), $options: 'i' } },
        { customerName: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const tickets = await Complaint.find(filter)
      .populate('customerId', 'name email phone')
      .populate('assignedStaffId')
      .populate('bookingId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get ticket details by ID
 * GET /api/support/tickets/:id
 */
const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ticket = await Complaint.findOne({
      $or: [{ complaintNumber: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
    })
      .populate('customerId', 'name email phone')
      .populate('assignedStaffId')
      .populate('bookingId');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update ticket status or resolution (Support Staff & Admin)
 * PUT /api/support/tickets/:id
 */
const updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, priority, resolutionNotes, assignedStaffId } = req.body;

    const ticket = await Complaint.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found.',
      });
    }

    if (status) ticket.status = status.toUpperCase();
    if (priority) ticket.priority = priority.toUpperCase();
    if (resolutionNotes) ticket.resolutionNotes = resolutionNotes;
    if (assignedStaffId) ticket.assignedStaffId = assignedStaffId;

    await ticket.save();

    // Notify Customer if status changed
    if (status) {
      await Notification.create({
        recipientUserId: ticket.customerId,
        recipientRole: 'CUSTOMER',
        type: 'SUPPORT_RESPONSE',
        title: `Ticket #${ticket.complaintNumber} Status Update`,
        message: `Your grievance ticket has been updated to ${ticket.status}. ${resolutionNotes ? `Resolution: ${resolutionNotes}` : ''}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Support ticket updated successfully.',
      data: ticket,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Respond to ticket conversation thread
 * POST /api/support/tickets/:id/respond
 */
const respondTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(422).json({
        success: false,
        message: 'Response message text is required.',
      });
    }

    const ticket = await Complaint.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found.',
      });
    }

    ticket.messages.push({
      sender: req.user.name,
      senderRole: req.user.role,
      message: message.trim(),
      timestamp: new Date(),
    });

    if (req.user.role === 'SUPPORT_STAFF' || req.user.role === 'ADMIN') {
      ticket.status = 'IN_INVESTIGATION';
    }

    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Message added to ticket conversation.',
      data: ticket.messages,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  respondTicket,
};
