const Service = require('../models/Service');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');
const Maintenance = require('../models/Maintenance');

/**
 * Intelligent LocalServe Service Assistant
 * Uses actual MongoDB data to deliver accurate local assistance
 */
const processMessage = async ({ message, user = null }) => {
  const query = (message || '').toLowerCase().trim();

  // 1. Booking Status Query
  if (
    query.includes('status') ||
    query.includes('my booking') ||
    query.includes('where is my technician') ||
    query.includes('track')
  ) {
    if (user && user._id) {
      const activeBooking = await Booking.findOne({
        customerId: user._id,
        status: { $nin: ['COMPLETED', 'SERVICE_COMPLETED', 'CANCELLED', 'REJECTED'] },
      }).sort({ createdAt: -1 });

      if (activeBooking) {
        return {
          reply: `Your active booking #${activeBooking.bookingNumber} for ${activeBooking.serviceName} is currently in status: "${activeBooking.status}". Scheduled for ${activeBooking.bookingDate} (${activeBooking.bookingTime}) at ${activeBooking.serviceAddress}. ${activeBooking.technicianName ? `Assigned technician: ${activeBooking.technicianName} (${activeBooking.technicianPhone || 'On standby'}).` : 'Workshop assignment in progress.'}`,
          actions: [
            { label: 'Track Booking Live', path: `/bookings/${activeBooking._id}` },
            { label: 'View All Bookings', path: '/bookings' },
          ],
        };
      } else {
        return {
          reply: 'You currently have no in-progress bookings. Would you like to schedule a new trade service or search local workshops?',
          actions: [
            { label: 'Explore Services', path: '/services' },
            { label: 'View Booking History', path: '/bookings' },
          ],
        };
      }
    } else {
      return {
        reply: 'To check your real-time booking status or technician dispatch details, please log in to your LocalServe account.',
        actions: [{ label: 'Log In to LocalServe', path: '/login' }],
      };
    }
  }

  // 2. Maintenance & Service Passport Query
  if (
    query.includes('maintenance') ||
    query.includes('passport') ||
    query.includes('warranty') ||
    query.includes('book again')
  ) {
    if (user && user._id) {
      const upcomingMaint = await Maintenance.findOne({
        customerId: user._id,
        reminderStatus: { $in: ['UPCOMING', 'DUE', 'OVERDUE'] },
      }).sort({ nextMaintenanceDate: 1 });

      if (upcomingMaint) {
        const nextDateStr = new Date(upcomingMaint.nextMaintenanceDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        return {
          reply: `You have an upcoming preventive maintenance scheduled for "${upcomingMaint.serviceName}" due on ${nextDateStr}. You can use 1-Click "Book Again" to rebook with pre-filled details.`,
          actions: [
            { label: 'Book Again Now', path: `/booking/${upcomingMaint.serviceId || 'ac'}` },
            { label: 'View Service Passport', path: '/service-passport' },
          ],
        };
      }
    }

    return {
      reply: 'LocalServe provides digital Service Passports for all completed repairs, including 3-month warranties and automated preventive maintenance reminders.',
      actions: [
        { label: 'View Service Passport', path: '/service-passport' },
        { label: 'Maintenance Schedules', path: '/maintenance' },
      ],
    };
  }

  // 3. Search Services from Catalogue (AC, Electrical, Plumbing, Cleaning, etc.)
  const serviceKeywords = ['ac', 'cool', 'electric', 'plumb', 'clean', 'sofa', 'paint', 'pest', 'repair', 'geyser', 'washing machine', 'water tank', 'car', 'bike', 'laptop', 'cctv'];
  const matchedKeyword = serviceKeywords.find((k) => query.includes(k));

  if (matchedKeyword || query.includes('service') || query.includes('cost') || query.includes('price')) {
    const searchRegex = matchedKeyword || query.replace(/service|cost|price|find|looking for/g, '').trim();
    const services = await Service.find({
      $or: [
        { name: { $regex: searchRegex, $options: 'i' } },
        { category: { $regex: searchRegex, $options: 'i' } },
        { description: { $regex: searchRegex, $options: 'i' } },
      ],
    }).limit(3);

    if (services.length > 0) {
      const serviceList = services
        .map((s) => `• ${s.name} (Starts at ₹${s.startingPrice}, ~${s.estimatedDuration})`)
        .join('\n');

      return {
        reply: `Here are the matching local services from our 80+ standardized catalogue:\n\n${serviceList}\n\nWould you like to book one of these services now?`,
        actions: services.map((s) => ({
          label: `Book ${s.name.slice(0, 24)}...`,
          path: `/booking/${s.serviceId || s._id}`,
        })),
      };
    }
  }

  // 4. Provider & Workshop Discovery
  if (query.includes('provider') || query.includes('shop') || query.includes('workshop') || query.includes('near me')) {
    const providers = await Provider.find({ availabilityStatus: 'AVAILABLE' }).limit(3);

    const providerList = providers
      .map((p) => `• ${p.shopName} (${p.rating}★ rating, ${p.serviceArea})`)
      .join('\n');

    return {
      reply: `Verified commercial workshops ready for immediate dispatch in Tirunelveli:\n\n${providerList}\n\nAll workshops include standardized pricing and verified technicians.`,
      actions: [
        { label: 'Find Nearby Providers', path: '/nearby-providers' },
        { label: 'Explore All Workshops', path: '/providers' },
      ],
    };
  }

  // 5. Frequently Asked Questions (Cancellations, Pricing, Safety)
  if (query.includes('cancel') || query.includes('refund')) {
    return {
      reply: 'You can cancel any booking before the service has commenced free of charge from your Customer Dashboard. Once a technician has started the job, cancellation requires support approval.',
      actions: [
        { label: 'My Bookings', path: '/bookings' },
        { label: 'Help & Support Desk', path: '/help-support' },
      ],
    };
  }

  // Default Guidance Response
  return {
    reply: 'Hello! I am your LocalServe Support Assistant. I can help you find trade services, locate verified workshops in Tirunelveli, track live bookings, or check your Service Passport maintenance dates. How may I assist you today?',
    actions: [
      { label: 'Explore 80+ Services', path: '/services' },
      { label: 'Find Nearby Workshops', path: '/nearby-providers' },
      { label: 'Track My Bookings', path: '/bookings' },
      { label: 'Service Passport', path: '/service-passport' },
    ],
  };
};

module.exports = { processMessage };
