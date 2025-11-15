const { body, validationResult } = require('express-validator');
const Bracelet = require('../models/Bracelet');
const logger = require('../config/logger');

const assignBracelet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { booking_id, bracelet_id } = req.body;
    
    const result = await Bracelet.assign(booking_id, bracelet_id);
    
    logger.info('Bracelet assigned', { booking_id, bracelet_id });
    
    res.json(result);
    
  } catch (error) {
    logger.error('Bracelet assignment failed', { error: error.message });
    res.status(400).json({ error: error.message });
  }
};

const verifyBracelet = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { bracelet_id, gate_no } = req.body;
    
    const result = await Bracelet.verify(bracelet_id, gate_no);
    
    logger.info('Bracelet verification', { bracelet_id, gate_no, status: result.status });
    
    res.json(result);
    
  } catch (error) {
    logger.error('Bracelet verification failed', { error: error.message });
    res.status(500).json({ error: 'Verification failed' });
  }
};

const validateAssignment = [
  body('booking_id').isInt().withMessage('Valid booking ID is required'),
  body('bracelet_id').notEmpty().withMessage('Bracelet ID is required')
];

const validateVerification = [
  body('bracelet_id').notEmpty().withMessage('Bracelet ID is required'),
  body('gate_no').notEmpty().withMessage('Gate number is required')
];

module.exports = {
  assignBracelet,
  verifyBracelet,
  validateAssignment,
  validateVerification
};