const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const { connectDB } = require('./config/db');
const { setupSocket } = require('./sockets/socketHandler');

const PORT = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

// Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

// Initialize real-time dispatch and location tracking
setupSocket(io);

// Start Server after connecting to Database
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log('========================================================');
      console.log(` LOCAL SERVICE BOOKING PLATFORM — BACKEND SERVER`);
      console.log(` Port: ${PORT}`);
      console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health: http://localhost:${PORT}/api/health`);
      console.log('========================================================');
    });
  } catch (error) {
    console.error('Fatal Server Startup Error:', error);
    process.exit(1);
  }
};

startServer();

// Handle Uncaught Rejections / Exceptions
process.on('unhandledRejection', (err) => {
  console.error('[Unhandled Rejection]:', err);
});

process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]:', err);
});
