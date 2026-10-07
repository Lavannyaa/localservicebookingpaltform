const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Provider = require('../models/Provider');
const Technician = require('../models/Technician');
const SupportStaff = require('../models/SupportStaff');
const Service = require('../models/Service');
const Category = require('../models/Category');
const { categoriesData, servicesData } = require('./serviceCatalogue');

const seedDatabase = async (shouldDisconnect = false) => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/localserve_db';

  try {
    if (mongoose.connection.readyState !== 1) {
      console.log(`[Seed] Connecting to MongoDB: ${uri}`);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('[Seed] Connected to MongoDB.');
    }

    // 1. Seed Categories
    console.log('[Seed] Seeding categories...');
    for (const cat of categoriesData) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        { ...cat },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] ${categoriesData.length} categories seeded.`);

    // 2. Seed 80+ Standardized Services
    console.log('[Seed] Seeding 80+ standardized trade services...');
    for (const srv of servicesData) {
      const categoryDoc = await Category.findOne({ name: srv.category });
      await Service.findOneAndUpdate(
        { serviceId: srv.serviceId },
        {
          ...srv,
          categoryId: categoryDoc ? categoryDoc._id : null,
        },
        { upsert: true, new: true }
      );
    }

    // Update serviceCount on categories
    for (const cat of categoriesData) {
      const count = await Service.countDocuments({ category: cat.name });
      await Category.findOneAndUpdate({ slug: cat.slug }, { serviceCount: count });
    }
    console.log(`[Seed] ${servicesData.length} standardized services seeded.`);

    // 3. Seed Required Test User Identities per Master Prompt Section 5
    console.log('[Seed] Seeding 5 authenticated role accounts...');

    // A. ADMIN: lavannyaalavannyaa@gmail.com
    const adminEmail = 'lavannyaalavannyaa@gmail.com';
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      const adminPassHash = await bcrypt.hash('Admin@2026!', 10);
      adminUser = await User.create({
        name: 'Lavannya (Super Admin)',
        email: adminEmail,
        phone: '+91 94431 55678',
        passwordHash: adminPassHash,
        role: 'ADMIN',
        isEmailVerified: true,
        authProvider: 'LOCAL',
        status: 'ACTIVE',
      });
      console.log(`[Seed] Admin user created: ${adminEmail}`);
    } else {
      adminUser.role = 'ADMIN';
      adminUser.isEmailVerified = true;
      await adminUser.save();
    }

    // B. SERVICE PROVIDER: 24104109@nec.edu.in
    const providerEmail = '24104109@nec.edu.in';
    let providerUser = await User.findOne({ email: providerEmail });
    if (!providerUser) {
      const provPassHash = await bcrypt.hash('Provider@2026!', 10);
      providerUser = await User.create({
        name: 'Senthil Kumar (FrostTech)',
        email: providerEmail,
        phone: '+91 98421 88712',
        passwordHash: provPassHash,
        role: 'PROVIDER',
        isEmailVerified: true,
        authProvider: 'LOCAL',
        status: 'ACTIVE',
      });
      console.log(`[Seed] Provider user created: ${providerEmail}`);
    } else {
      providerUser.role = 'PROVIDER';
      providerUser.isEmailVerified = true;
      await providerUser.save();
    }

    // Create / Update Provider Shop Record
    let providerShop = await Provider.findOne({ userId: providerUser._id });
    if (!providerShop) {
      providerShop = await Provider.create({
        providerId: 'PRV-TNV-001',
        userId: providerUser._id,
        providerName: 'Senthil Kumar',
        shopName: 'FrostTech AC & Electrical Solutions',
        shopAddress: '45 North Car Street, Vannarpettai, Tirunelveli - 627003',
        city: 'Tirunelveli',
        serviceArea: 'Tirunelveli & Palayamkottai (25 km radius)',
        specialization: ['AC & Appliances', 'Electrical', 'Home Repair'],
        experience: 9,
        availabilityStatus: 'AVAILABLE',
        workingHours: '08:00 AM - 08:00 PM',
        rating: 4.9,
        reviewCount: 42,
        latitude: 8.7215,
        verified: true,
      });
      console.log('[Seed] Provider shop record created.');
    }

    // Additional verified shops for nearby discovery
    const extraShops = [
      {
        providerId: 'PRV-TNV-002',
        providerName: 'Ravi Kumar',
        shopName: 'Kumar Electricals & Rewinding Works',
        shopAddress: '124 South Bypass Road, Palayamkottai, Tirunelveli - 627005',
        city: 'Tirunelveli',
        serviceArea: 'Palayamkottai & Perumalpuram',
        specialization: ['Electrical Works', 'Appliance Repair'],
        experience: 12,
        availabilityStatus: 'AVAILABLE',
        workingHours: '08:30 AM - 08:30 PM',
        rating: 4.8,
        reviewCount: 38,
        latitude: 8.718,
        longitude: 77.749,
        verified: true,
      },
      {
        providerId: 'PRV-TNV-003',
        providerName: 'Karthik Raja',
        shopName: 'SpeedFix Automobile & Bike Works',
        shopAddress: '88 Trivandrum Road, Murugankurichi, Tirunelveli - 627002',
        city: 'Tirunelveli',
        serviceArea: 'Central Tirunelveli & Junction',
        specialization: ['Vehicle Services', 'Emergency Breakdown'],
        experience: 8,
        availabilityStatus: 'AVAILABLE',
        workingHours: '07:30 AM - 09:00 PM',
        rating: 4.7,
        reviewCount: 29,
        latitude: 8.715,
        longitude: 77.738,
        verified: true,
      },
      {
        providerId: 'PRV-TNV-004',
        providerName: 'M. Muthu',
        shopName: 'Apex Plumbing & Water Systems',
        shopAddress: '12 S.N. High Road, Tirunelveli Junction - 627001',
        city: 'Tirunelveli',
        serviceArea: 'Junction, Town & Pettai',
        specialization: ['Plumbing & Water', 'Pest Control'],
        experience: 14,
        availabilityStatus: 'AVAILABLE',
        workingHours: '08:00 AM - 07:00 PM',
        rating: 4.9,
        reviewCount: 51,
        latitude: 8.728,
        longitude: 77.729,
        verified: true,
      },
    ];

    for (const shop of extraShops) {
      await Provider.findOneAndUpdate(
        { providerId: shop.providerId },
        { ...shop },
        { upsert: true, new: true }
      );
    }
    console.log('[Seed] Additional provider shops seeded.');

    // C. SUPPORT STAFF: 24104096@nec.edu.in (Notice valid email syntax)
    const supportEmail = '24104096@nec.edu.in';
    let supportUser = await User.findOne({ email: supportEmail });
    if (!supportUser) {
      const suppPassHash = await bcrypt.hash('Support@2026!', 10);
      supportUser = await User.create({
        name: 'Priya Raman (Support Desk)',
        email: supportEmail,
        phone: '+91 97892 44319',
        passwordHash: suppPassHash,
        role: 'SUPPORT_STAFF',
        isEmailVerified: true,
        authProvider: 'LOCAL',
        status: 'ACTIVE',
      });
      console.log(`[Seed] Support Staff user created: ${supportEmail}`);
    } else {
      supportUser.role = 'SUPPORT_STAFF';
      supportUser.isEmailVerified = true;
      await supportUser.save();
    }

    let supportProfile = await SupportStaff.findOne({ userId: supportUser._id });
    if (!supportProfile) {
      await SupportStaff.create({
        supportStaffId: 'SUP-TNV-108',
        userId: supportUser._id,
        staffName: supportUser.name,
        department: 'Customer Grievances & Service Escalations',
        status: 'ONLINE',
      });
      console.log('[Seed] Support Staff profile created.');
    }

    // D. TECHNICIAN: murugan.tech@localserve.in
    const techEmail = 'murugan.tech@localserve.in';
    let techUser = await User.findOne({ email: techEmail });
    if (!techUser) {
      const techPassHash = await bcrypt.hash('Tech@2026!', 10);
      techUser = await User.create({
        name: 'Murugan K (Master AC Tech)',
        email: techEmail,
        phone: '+91 98401 77654',
        passwordHash: techPassHash,
        role: 'TECHNICIAN',
        isEmailVerified: true,
        authProvider: 'LOCAL',
        status: 'ACTIVE',
      });
      console.log(`[Seed] Technician user created: ${techEmail}`);
    }

    let technicianProfile = await Technician.findOne({ userId: techUser._id });
    if (!technicianProfile) {
      await Technician.create({
        technicianId: 'TECH-TNV-042',
        userId: techUser._id,
        providerId: providerShop._id,
        technicianName: 'Murugan K',
        phone: '+91 98401 77654',
        specialization: 'AC & Refrigeration Certified Master',
        experience: 7,
        availabilityStatus: 'AVAILABLE',
        workingHours: '09:00 AM - 07:00 PM',
        rating: 4.95,
        verified: true,
        currentLatitude: 8.7189,
        currentLongitude: 77.7561,
        locationPermissionGranted: true,
      });
      console.log('[Seed] Technician profile created under FrostTech.');
    }

    // E. CUSTOMER: rahul.sharma@example.com
    const customerEmail = 'rahul.sharma@example.com';
    let customerUser = await User.findOne({ email: customerEmail });
    if (!customerUser) {
      const custPassHash = await bcrypt.hash('Customer@2026!', 10);
      customerUser = await User.create({
        name: 'Rahul Sharma',
        email: customerEmail,
        phone: '+91 98401 23456',
        passwordHash: custPassHash,
        role: 'CUSTOMER',
        isEmailVerified: true,
        authProvider: 'LOCAL',
        status: 'ACTIVE',
      });
      console.log(`[Seed] Verified Customer created: ${customerEmail}`);
    }

    console.log('============================================================');
    console.log('[Seed] Database initialization completed successfully!');
    console.log('Test Accounts Prepared:');
    console.log(`• ADMIN:         ${adminEmail} (Password: Admin@2026!)`);
    console.log(`• PROVIDER:      ${providerEmail} (Password: Provider@2026!)`);
    console.log(`• SUPPORT STAFF: ${supportEmail} (Password: Support@2026!)`);
    console.log(`• TECHNICIAN:    ${techEmail} (Password: Tech@2026!)`);
    console.log(`• CUSTOMER:      ${customerEmail} (Password: Customer@2026!)`);
    console.log('============================================================');

    if (shouldDisconnect) {
      await mongoose.disconnect();
      process.exit(0);
    }
  } catch (err) {
    console.error(`[Seed Error] Failed to seed database: ${err.message}`);
    if (shouldDisconnect) {
      process.exit(1);
    }
    throw err;
  }
};

if (require.main === module) {
  seedDatabase(true);
}

module.exports = { seedDatabase };
