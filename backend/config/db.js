const mongoose = require('mongoose');

let isConnected = false;
let mongoServerInstance = null;

const connectDB = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/localserve_db';

  try {
    console.log(`[MongoDB] Connecting to MongoDB instance at: ${uri}`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });

    isConnected = true;
    console.log(`[MongoDB] Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Auto-seed if database is empty
    const User = require('../models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[MongoDB] Empty database detected. Running seedData...');
      const { seedDatabase } = require('../seed/seedData');
      await seedDatabase(false);
    }

    return conn;
  } catch (err) {
    console.warn(`[MongoDB Warning] Direct connection to ${uri} failed (${err.message}).`);
    console.log('[MongoDB] Initializing in-memory MongoDB engine (MongoMemoryServer)...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServerInstance = await MongoMemoryServer.create();
      const inMemoryUri = mongoServerInstance.getUri();

      const conn = await mongoose.connect(inMemoryUri);
      isConnected = true;
      console.log(`[MongoDB] In-Memory MongoDB Connected Successfully: ${inMemoryUri}`);

      // Seed data into the in-memory database
      const { seedDatabase } = require('../seed/seedData');
      await seedDatabase(false);

      return conn;
    } catch (memErr) {
      console.error('[MongoDB Error] In-Memory MongoDB failed to start:', memErr.message);
      return null;
    }
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('[MongoDB] Disconnected from database.');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('[MongoDB] Reconnected to database.');
});

module.exports = { connectDB, getIsConnected: () => isConnected };
