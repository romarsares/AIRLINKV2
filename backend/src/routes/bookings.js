// Express router for booking endpoints
const express = require('express');
const router = express.Router();
// Booking controller functions used in routes
const { createBooking, validateBooking } = require('../controllers/bookingController');
// Auth middleware used for protected routes
const { authenticateToken } = require('../middleware/auth');
// Database pool used for booking queries
const { pool } = require('../config/database');
// Logger used for booking operations
const logger = require('../config/logger');

// POST /api/bookings - Create flight booking
router.post('/', authenticateToken, validateBooking, createBooking);

// GET /api/bookings/:booking_id - Retrieve booking details
router.get('/:booking_id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT b.*, p.name, p.email, p.contact_no, f.flight_no, f.destination, f.departure_time, f.gate_no
       FROM bookings b 
       JOIN passengers p ON b.passenger_id = p.passenger_id 
       JOIN flights f ON b.flight_id = f.flight_id 
       WHERE b.booking_id = ?`,
      [req.params.booking_id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    logger.info('Booking retrieved', { booking_id: req.params.booking_id });
    res.json(rows[0]);
  } catch (error) {
    logger.error('Booking retrieval failed', { error: error.message });
    res.status(500).json({ error: 'Failed to retrieve booking' });
  }
});

module.exports = router;