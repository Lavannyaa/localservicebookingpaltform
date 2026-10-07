let ioInstance = null;

const setupSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join room for specific booking tracking
    socket.on('join:booking', (bookingId) => {
      socket.join(`booking_${bookingId}`);
      console.log(`[Socket.IO] Client ${socket.id} joined room booking_${bookingId}`);
    });

    // Leave booking room
    socket.on('leave:booking', (bookingId) => {
      socket.leave(`booking_${bookingId}`);
    });

    // Technician live location broadcast (permission-based, during active service only)
    socket.on('technician:locationUpdate', ({ bookingId, lat, lng }) => {
      if (bookingId && lat && lng) {
        io.to(`booking_${bookingId}`).emit('technician:locationChanged', {
          bookingId,
          lat,
          lng,
          timestamp: new Date().toISOString(),
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => ioInstance;

module.exports = { setupSocket, getIO };
