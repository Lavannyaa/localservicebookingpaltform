import api from './api';

let customApiEndpoint = null;
let customApiKey = null;

export const chatbotService = {
  /**
   * Configure an external LLM / Chatbot API endpoint if connecting to a real backend in future.
   */
  configureEndpoint(url, apiKey = null) {
    customApiEndpoint = url;
    customApiKey = apiKey;
  },

  getEndpoint() {
    return customApiEndpoint;
  },

  /**
   * Send message to the service support engine.
   * Connects to backend API POST /api/chatbot/message first.
   */
  async sendMessage(userInput, history = [], context = {}) {
    // 1. Primary: Live Backend Chatbot REST API
    try {
      const res = await api.post('/chatbot/message', {
        message: userInput,
        history,
        context: {
          platform: 'LocalServe',
          city: 'Tirunelveli',
          ...context
        }
      });

      if (res.data?.success && res.data?.data?.reply) {
        return {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: res.data.data.reply,
          quickReplies: ['AC Repair', 'Electrical Wiring', 'Plumbing', 'My Bookings'],
          actions: (res.data.data.actions || []).map(a => ({
            label: a.label,
            url: a.path,
            variant: 'primary'
          })),
          timestamp: res.data.data.timestamp || new Date().toISOString()
        };
      }
    } catch (apiErr) {
      console.warn('[chatbotService] API unreachable, falling back to local domain rules engine:', apiErr.message);
    }

    // 2. Fallback: Local domain-specific NLP & rules engine
    return new Promise((resolve) => {
      setTimeout(async () => {
        const reply = await generateLocalServeResponse(userInput, context);
        resolve(reply);
      }, 300);
    });
  }
};

/**
 * Intelligent domain-specific rule & NLP matcher for LocalServe
 */
async function generateLocalServeResponse(input, context = {}) {
  const text = (input || '').toLowerCase().trim();

  // 1. CANCELLATION & RESCHEDULING / HELP
  if (
    text.includes('cancel') ||
    text.includes('refund') ||
    text.includes('reschedule') ||
    text.includes('complaint') ||
    text.includes('contact help')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `Here is our official **Cancellation & Customer Support Policy**:

• **Free Cancellation**: You can cancel any booking free of charge prior to technician dispatch directly from **My Bookings**.
• **Rescheduling**: Need to adjust your time slot? Visit your booking details page to choose an alternative arrival window.
• **100% Refund Guarantee**: In the rare event of cancellation after payment, full refunds are credited back to your original source within 24–48 hours.
• **Customer Care Line**: Reach our local resolution desk toll-free at **1800-LOCAL-SRV** (8 AM – 9 PM daily).`,
      quickReplies: ['Track My Booking', 'View Help Center', 'Find a Service'],
      actions: [
        { label: 'Go to My Bookings', url: '/bookings', variant: 'primary' },
        { label: 'Submit Support Ticket', url: '/help-support', variant: 'outline' }
      ]
    };
  }

  // 2. BOOKING STATUS & TRACKING
  if (
    text.includes('status') ||
    text.includes('track') ||
    text.includes('where is my') ||
    text.includes('order') ||
    text.includes('progress') ||
    text.includes('my booking')
  ) {
    try {
      const allBookings = await bookingService.getBookings();
      const active = allBookings.find(b =>
        ['Pending', 'Accepted', 'Technician Assigned', 'On the Way', 'On The Way', 'Arrived', 'Service Started'].includes(b.status)
      ) || allBookings[0];

      if (active) {
        return {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `I located your active service work order **#${active.bookingNumber}** for **${active.serviceName}**. Here is the live status:`,
          bookingCard: {
            bookingNumber: active.bookingNumber,
            serviceName: active.serviceName,
            status: active.status,
            providerName: active.providerName,
            technicianName: active.technicianName || 'Assigning certified technician...',
            scheduledDate: `${active.bookingDate} (${active.bookingTime})`,
            address: active.address,
            totalAmount: active.totalAmount || active.price,
            trackingUrl: `/bookings/${active.bookingId}`
          },
          quickReplies: ['Cancellation Policy', 'Maintenance Schedule', 'Find Another Service'],
          actions: [
            { label: 'Open Live 8-Stage Tracker', url: `/bookings/${active.bookingId}`, variant: 'primary' },
            { label: 'View All Bookings', url: '/bookings', variant: 'outline' }
          ]
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `You currently have no active pending bookings under your account. Would you like to schedule a certified repair or maintenance service?`,
      quickReplies: ['Browse Popular Services', 'AC Jet Wash', 'Plumbing Service'],
      actions: [{ label: 'Explore Services', url: '/services', variant: 'primary' }]
    };
  }

  // 3. MAINTENANCE REMINDERS & SERVICE PASSPORT
  if (
    text.includes('maintenance') ||
    text.includes('passport') ||
    text.includes('warranty') ||
    text.includes('amc') ||
    text.includes('next service') ||
    text.includes('due date') ||
    text.includes('schedule')
  ) {
    try {
      const appliances = await servicePassportService.getPassportAppliances();
      const firstApp = appliances[0];
      const sched = firstApp?.maintenanceSchedule;

      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Here is your current **Digital Service Passport & Maintenance Status**:

• **Passport ID**: \`#PASSPORT-TNV-2026-081\`
• **Tracked Appliance**: ${firstApp ? firstApp.applianceName : 'Daikin Inverter 1.5T Split AC'}
• **Next Scheduled Overhaul**: **${sched ? sched.nextServiceDate : '28 December 2026'}** (${sched ? sched.interval : '3 Months (Quarterly)'})
• **Warranty Status**: Active 30-Day LocalServe Workmanship Guarantee
• **Appliance Health Score**: ${firstApp ? firstApp.currentHealthScore : '94% (Good Condition)'}

You can one-click re-book with pre-filled service details through our **Book Again** feature.`,
        quickReplies: ['Book Again Now', 'View Full Passport', 'How does warranty work?'],
        actions: [
          {
            label: 'Book Again (Pre-filled)',
            url: `/booking/srv-3?mode=book-again&appliance=${encodeURIComponent(firstApp?.applianceName || 'Daikin Inverter AC')}&providerName=FrostTech+AC+Solutions&nextSuggestedDate=${sched?.nextServiceDate || '2026-12-28'}`,
            variant: 'primary'
          },
          { label: 'Open Service Passport', url: '/passport', variant: 'outline' }
        ]
      };
    } catch (e) {
      console.error(e);
    }
  }

  // 4. FINDING A SPECIFIC SERVICE
  const serviceKeywords = [
    'ac', 'air conditioner', 'leak', 'plumb', 'pipe', 'tap', 'electr', 'wire',
    'fan', 'light', 'clean', 'deep clean', 'paint', 'pest', 'cockroach',
    'carpenter', 'furniture', 'door lock', 'purifier', 'ro water', 'geyser',
    'refrigerator', 'washing machine', 'cctv', 'car wash', 'vehicle', 'mechanic',
    'mason', 'tile', 'roof', 'interior', 'false ceiling'
  ];

  const matchedKeyword = serviceKeywords.find(k => text.includes(k));
  if (matchedKeyword || text.includes('search') || text.includes('find service')) {
    const searchTarget = matchedKeyword || text.replace('find', '').replace('service', '').trim() || 'ac';
    const matches = await serviceService.getServices({ search: searchTarget });
    const topMatches = matches.slice(0, 3);

    if (topMatches.length > 0) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `I found **${matches.length} standardized services** matching "${searchTarget}" with certified neighbourhood workshops and transparent pricing:`,
        serviceCards: topMatches.map(s => ({
          serviceId: s.serviceId,
          serviceName: s.serviceName,
          category: s.category,
          basePrice: s.basePrice,
          rating: s.rating,
          reviewCount: s.reviewCount,
          duration: s.duration || '60-90 mins',
          providerName: s.providerName || 'LocalServe Partner',
          detailUrl: `/services/${s.serviceId}`,
          bookUrl: `/booking/${s.serviceId}`
        })),
        quickReplies: ['How do I book?', 'Browse Categories', 'Find Nearby Shops'],
        actions: [{ label: `View All ${matches.length} Results`, url: `/services?search=${encodeURIComponent(searchTarget)}`, variant: 'outline' }]
      };
    }
  }

  // 5. SERVICE CATEGORIES SUGGESTIONS
  if (
    text.includes('category') ||
    text.includes('categories') ||
    text.includes('what services') ||
    text.includes('what do you offer') ||
    text.includes('trades')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `LocalServe offers **over 80+ standardized commercial and residential services** across 18 specialized trade categories:

1. **AC & Appliances** (Jet Wash, Gas Charging, Refrigerator, RO Purifier)
2. **Electrical Services** (Rewiring, MCB Distribution, DB Board, Fan & Light)
3. **Plumbing Services** (Concealed Leak Detection, Pipe Replacement, Sanitary Fittings)
4. **Deep Cleaning & Sanitization** (Full House, Kitchen Degreasing, Bathroom)
5. **Pest Control Services** (Termite Protection, Herbal Gel Cockroach Treatment)
6. **Carpentry & Woodwork** (Door Lock Overhaul, Custom Modular Cabinets)
7. **House & Commercial Painting** (Waterproof Exterior, Royale Luxury Interior)
8. **Vehicle Care** (Doorstep Car Foam Wash, Two-Wheeler Inspection)

Which category would you like to explore?`,
      quickReplies: ['AC & Appliances', 'Electrical', 'Plumbing', 'Cleaning', 'Pest Control', 'Painting'],
      actions: [{ label: 'Browse All 18 Categories', url: '/categories', variant: 'primary' }]
    };
  }

  // 6. PROVIDER / WORKSHOP DISCOVERY
  if (
    text.includes('provider') ||
    text.includes('shop') ||
    text.includes('workshop') ||
    text.includes('near me') ||
    text.includes('nearby') ||
    text.includes('store')
  ) {
    try {
      const providers = await providerService.getProviders();
      const topShops = providers.slice(0, 3);

      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Unlike ordinary platforms with unverified freelancers, **every LocalServe provider is a registered commercial business with a physical workshop**:`,
        providerCards: topShops.map(p => ({
          providerId: p.providerId,
          shopName: p.shopName,
          category: p.category || 'Multi-Trade Workshop',
          area: p.area || 'Tirunelveli Central',
          distance: p.distance || '1.2 km away',
          rating: p.rating,
          verified: true,
          shopUrl: `/providers/${p.providerId}`
        })),
        quickReplies: ['Search Nearby Map', 'Find AC Service', 'Booking Guide'],
        actions: [
          { label: 'View Nearby Workshops Map', url: '/nearby-providers', variant: 'primary' },
          { label: 'All Registered Providers', url: '/providers', variant: 'outline' }
        ]
      };
    } catch (e) {
      console.error(e);
    }
  }

  // 7. BOOKING GUIDANCE
  if (
    text.includes('how to book') ||
    text.includes('booking guide') ||
    text.includes('how it works') ||
    text.includes('steps') ||
    text.includes('help me book')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `Booking on LocalServe takes under **60 seconds** in 4 simple steps:

1️⃣ **Select Service**: Pick from 80+ standardized rate-card services.
2️⃣ **Choose Workshop**: Select a verified commercial provider in your area.
3️⃣ **Pick Schedule**: Choose your preferred arrival window (Morning, Afternoon, Evening).
4️⃣ **Live 8-Stage Tracking**: Follow technician dispatch, arrival, checklist execution, and receive an official **Digital Service Passport logbook**.

All services include a **30-day workmanship warranty**.`,
      quickReplies: ['Search Services Now', 'Payment Options', 'Frequently Asked Questions'],
      actions: [
        { label: 'Start Booking Now', url: '/services', variant: 'primary' },
        { label: 'Browse Categories', url: '/categories', variant: 'outline' }
      ]
    };
  }

  // 8. FAQS & PRICING / WARRANTY
  if (
    text.includes('faq') ||
    text.includes('price') ||
    text.includes('cost') ||
    text.includes('pricing') ||
    text.includes('charge') ||
    text.includes('pay') ||
    text.includes('payment') ||
    text.includes('safety') ||
    text.includes('guarantee')
  ) {
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `Here are answers to our **Most Frequently Asked Questions**:

• **Pricing**: All prices are transparent and standardized in INR. No bargaining or post-job surprise fees.
• **Payment Methods**: We accept Cash on Delivery, UPI (Google Pay, PhonePe, Paytm), and Credit/Debit cards upon job satisfaction.
• **Warranty**: Every completed job is backed by a **30-Day LocalServe Warranty** automatically recorded in your Digital Service Passport.
• **Technician Safety**: All technicians carry physical company ID cards, wear company uniforms, and have verified background checks.`,
      quickReplies: ['Find a Service', 'Track My Booking', 'Cancellation Policy'],
      actions: [{ label: 'Read Full Help Center', url: '/help-support', variant: 'outline' }]
    };
  }

  // DEFAULT FALLBACK: Intelligent Service Support Greeting
  return {
    id: `bot-${Date.now()}`,
    sender: 'bot',
    text: `Hello! I am your **LocalServe Support Assistant**. I can help you with:

• 🔍 **Finding a Service** (e.g., "AC repair", "leaking tap", "house painting")
• 📂 **Service Categories** (Browse our 18 specialized trade verticals)
• 📦 **Tracking Your Booking** (Live status of ongoing technician dispatch)
• 📅 **Maintenance Schedules** (Automated reminders and Service Passport)
• 🏪 **Nearby Workshops** (Find certified physical shops in your area)
• ❓ **Help & Policies** (Cancellation, warranty, pricing FAQs)

What would you like assistance with today?`,
    quickReplies: [
      '🔍 Find a Service',
      '📦 Track My Booking',
      '📅 Maintenance Schedule',
      '📂 Browse Categories',
      '🏪 Find Nearby Shops',
      '❓ FAQs & Cancellation'
    ]
  };
}
