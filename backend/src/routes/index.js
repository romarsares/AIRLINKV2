const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const bookingsRoutes = require('./bookings');
const braceletsRoutes = require('./bracelets');
const adminRoutes = require('./admin');

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'AirLink API',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/bracelets', braceletsRoutes);
router.use('/admin', adminRoutes);
router.use('/sync_logs', adminRoutes);
router.use('/sync', adminRoutes);

module.exports = router;