import { Server } from 'socket.io';

let io = null;

/**
 * Initialize Socket.io server
 * Call this from your main server file (index.js)
 */
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User joins their personal room (for targeted events)
    socket.on('join:user', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`✅ User ${userId} joined their room`);
    });

    // User joins an interview session room
    socket.on('join:interview', (sessionId) => {
      socket.join(`interview:${sessionId}`);
      console.log(`✅ Socket joined interview room: ${sessionId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  console.log('✅ Socket.io initialized');
  return io;
};

/**
 * Emit event to a specific user's room
 * @param {string} userId - User ID
 * @param {string} event - Event name
 * @param {object} data - Data to send
 */
export const emitToUser = (userId, event, data) => {
  if (!io) {
    console.warn('⚠️  Socket.io not initialized. Skipping emit.');
    return;
  }
  io.to(`user:${userId}`).emit(event, data);
  console.log(`📤 Emitted ${event} to user:${userId}`);
};

/**
 * Emit event to an interview session room
 * @param {string} sessionId - Session ID
 * @param {string} event - Event name
 * @param {object} data - Data to send
 */
export const emitToInterview = (sessionId, event, data) => {
  if (!io) {
    console.warn('⚠️  Socket.io not initialized. Skipping emit.');
    return;
  }
  io.to(`interview:${sessionId}`).emit(event, data);
  console.log(`📤 Emitted ${event} to interview:${sessionId}`);
};

/**
 * Get the Socket.io instance
 */
export const getIO = () => io;