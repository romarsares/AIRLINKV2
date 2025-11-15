const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const logger = require('../config/logger');

const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { passenger, flight_no, seat_no } = req.body;
    
    const result = await Booking.create(passenger, flight_no, seat_no);
    
    logger.info('Booking created', { booking_id: result.booking_id, flight_no });
    
    res.status(201).json(result);
    
  } catch (error) {
    logger.error('Booking creation failed', { error: error.message });
    res.status(500).json({ error: 'Booking creation failed' });
  }
};

const validateBooking = [
  body('passenger.name').notEmpty().withMessage('Passenger name is required'),
  body('passenger.email').isEmail().withMessage('Valid email is required'),
  body('flight_no').notEmpty().withMessage('Flight number is required'),
  body('seat_no').notEmpty().withMessage('Seat number is required')
];

module.exports = {
  createBooking,
  validateBooking
};