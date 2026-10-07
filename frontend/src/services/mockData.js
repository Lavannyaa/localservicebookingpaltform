export const categories = [
  { categoryId: 1, categoryName: 'Home Cleaning', icon: '🧹', description: 'Deep & regular cleaning', status: 'active' },
  { categoryId: 2, categoryName: 'Electrician', icon: '💡', description: 'Wiring & repairs', status: 'active' },
  { categoryId: 3, categoryName: 'Plumbing', icon: '🚰', description: 'Leaks & installations', status: 'active' },
  { categoryId: 4, categoryName: 'AC Repair', icon: '❄️', description: 'Service & gas refill', status: 'active' },
  { categoryId: 5, categoryName: 'Carpentry', icon: '🪚', description: 'Furniture & fittings', status: 'active' },
  { categoryId: 6, categoryName: 'Painting', icon: '🎨', description: 'Interior & exterior', status: 'active' },
  { categoryId: 7, categoryName: 'Pest Control', icon: '🐜', description: 'Safe fumigation', status: 'active' },
  { categoryId: 8, categoryName: 'Appliance Repair', icon: '🔧', description: 'All brands supported', status: 'active' },
];

export const providers = [
  { providerId: 1, providerName: 'Ravi Kumar', shopName: 'Kumar Electricals', shopAddress: '12 Gandhi St', city: 'Tirunelveli', serviceArea: '5km', email: 'ravi@example.com', phoneNumber: '9876543210', specialization: 'Electrician', experience: '8 yrs', availabilityStatus: true, workingHours: '9AM - 7PM', rating: 4.8, reviews: 132, avatar: 'https://i.pravatar.cc/150?img=12' },
  { providerId: 2, providerName: 'Meena S', shopName: 'Sparkle Cleaners', shopAddress: '45 Anna Nagar', city: 'Tirunelveli', serviceArea: '8km', email: 'meena@example.com', phoneNumber: '9876543211', specialization: 'Home Cleaning', experience: '5 yrs', availabilityStatus: true, workingHours: '8AM - 6PM', rating: 4.9, reviews: 210, avatar: 'https://i.pravatar.cc/150?img=45' },
  { providerId: 3, providerName: 'Suresh Babu', shopName: 'FlowFix Plumbing', shopAddress: '9 Market Rd', city: 'Tirunelveli', serviceArea: '10km', email: 'suresh@example.com', phoneNumber: '9876543212', specialization: 'Plumbing', experience: '10 yrs', availabilityStatus: false, workingHours: '10AM - 8PM', rating: 4.6, reviews: 98, avatar: 'https://i.pravatar.cc/150?img=33' },
  { providerId: 4, providerName: 'Arjun Dev', shopName: 'CoolAir Services', shopAddress: '78 Palayamkottai', city: 'Tirunelveli', serviceArea: '12km', email: 'arjun@example.com', phoneNumber: '9876543213', specialization: 'AC Repair', experience: '6 yrs', availabilityStatus: true, workingHours: '9AM - 9PM', rating: 4.7, reviews: 156, avatar: 'https://i.pravatar.cc/150?img=22' },
];

export const services = [
  { serviceId: 1, serviceName: 'Deep Home Cleaning', description: 'Complete deep cleaning for kitchen, bathroom & living areas with eco-friendly products.', price: 1499, estimatedDuration: '3 hrs', categoryId: 1, providerId: 2, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600' },
  { serviceId: 2, serviceName: 'Ceiling Fan Installation', description: 'Professional installation of ceiling fans with safety checks.', price: 399, estimatedDuration: '45 min', categoryId: 2, providerId: 1, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600' },
  { serviceId: 3, serviceName: 'Bathroom Leak Repair', description: 'Fix leaking pipes, taps and fittings with warranty on parts.', price: 599, estimatedDuration: '1.5 hrs', categoryId: 3, providerId: 3, image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600' },
  { serviceId: 4, serviceName: 'AC Gas Refill & Service', description: 'Full AC servicing including gas refill and filter cleaning.', price: 1299, estimatedDuration: '1 hr', categoryId: 4, providerId: 4, image: 'https://images.unsplash.com/photo-1631545806609-347bb1e9dfec?w=600' },
  { serviceId: 5, serviceName: 'Wooden Furniture Repair', description: 'Repair and polish for wooden furniture and cabinets.', price: 899, estimatedDuration: '2 hrs', categoryId: 5, providerId: 1, image: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=600' },
  { serviceId: 6, serviceName: 'Interior Wall Painting', description: 'Premium emulsion painting for interior walls with 2 coats.', price: 3499, estimatedDuration: '1 day', categoryId: 6, providerId: 2, image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600' },
  { serviceId: 7, serviceName: 'General Pest Control', description: 'Safe and effective pest control for the whole home.', price: 999, estimatedDuration: '1.5 hrs', categoryId: 7, providerId: 3, image: 'https://images.unsplash.com/photo-1632934494866-fb2ecb1e6d0b?w=600' },
  { serviceId: 8, serviceName: 'Washing Machine Repair', description: 'Diagnosis and repair for all washing machine brands.', price: 549, estimatedDuration: '1 hr', categoryId: 8, providerId: 4, image: 'https://images.unsplash.com/photo-1washer?w=600' },
];

export const reviews = [
  { reviewId: 1, customerId: 1, providerId: 2, rating: 5, comment: 'Excellent cleaning service, very thorough!', reviewDate: '2026-07-20', customerName: 'Priya R' },
  { reviewId: 2, customerId: 2, providerId: 1, rating: 4.5, comment: 'Fixed my fan quickly and professionally.', reviewDate: '2026-07-18', customerName: 'Karthik M' },
  { reviewId: 3, customerId: 3, providerId: 4, rating: 5, comment: 'AC works like new. Highly recommend!', reviewDate: '2026-07-15', customerName: 'Anitha V' },
];

export const bookings = [
  { bookingId: 101, bookingDate: '2026-08-10', bookingTime: '10:00 AM', serviceDate: '2026-08-10', bookingStatus: 'Confirmed', customerId: 1, providerId: 2, serviceId: 1, totalAmount: 1499, address: '22 Lake View St, Tirunelveli' },
  { bookingId: 102, bookingDate: '2026-08-02', bookingTime: '2:00 PM', serviceDate: '2026-08-02', bookingStatus: 'Completed', customerId: 1, providerId: 1, serviceId: 2, totalAmount: 399, address: '22 Lake View St, Tirunelveli' },
  { bookingId: 103, bookingDate: '2026-07-25', bookingTime: '11:00 AM', serviceDate: '2026-07-25', bookingStatus: 'Cancelled', customerId: 1, providerId: 3, serviceId: 3, totalAmount: 599, address: '22 Lake View St, Tirunelveli' },
];

export const notifications = [
  { notificationId: 1, customerId: 1, message: 'Your AC service is scheduled for tomorrow at 10 AM', notificationDate: '2026-08-04', notificationType: 'reminder', status: 'unread' },
  { notificationId: 2, customerId: 1, message: 'Booking #102 has been marked completed', notificationDate: '2026-08-02', notificationType: 'booking', status: 'read' },
  { notificationId: 3, customerId: 1, message: '20% off on Pest Control services this week!', notificationDate: '2026-08-01', notificationType: 'promo', status: 'unread' },
];

export const maintenanceReminders = [
  { scheduleId: 1, applianceName: 'Air Conditioner', lastServiceDate: '2026-02-10', nextServiceDate: '2026-08-10', reminderInterval: '6 months', status: 'due-soon' },
  { scheduleId: 2, applianceName: 'Water Heater', lastServiceDate: '2026-01-05', nextServiceDate: '2026-07-05', reminderInterval: '6 months', status: 'overdue' },
  { scheduleId: 3, applianceName: 'RO Water Purifier', lastServiceDate: '2026-06-01', nextServiceDate: '2026-09-01', reminderInterval: '3 months', status: 'upcoming' },
];
