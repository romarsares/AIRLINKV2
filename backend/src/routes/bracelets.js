// Express router for bracelet endpoints
const express = require('express');
const router = express.Router();
// Bracelet controller functions used in routes
const { 
  assignBracelet, 
  verifyBracelet, 
  validateAssignment, 
  validateVerification 
} = require('../controllers/braceletController');
// Auth middleware used across bracelet routes
const { authenticateToken, authorizeRole } = require('../middleware/auth');
// Validator used for input validation
const { body } = require('express-validator');
// Database pool used for bracelet operations
const { pool } = require('../config/database');
// Logger used for bracelet operations
const logger = require('../config/logger');

// POST /api/bracelets/assign - Assign bracelet to passenger
router.post('/assign', authenticateToken, authorizeRole(['Admin', 'Operator']), validateAssignment, assignBracelet);

// POST /api/bracelets/verify - Verify boarding eligibility
router.post('/verify', authenticateToken, validateVerification, verifyBracelet);

// GET /api/bracelets/:bracelet_id/status - Get bracelet status
router.get('/:bracelet_id/status', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT bracelet_id, status, battery_level, last_sync_time FROM bracelets WHERE bracelet_id = ?',
      [req.params.bracelet_id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bracelet not found' });
    }
    
    logger.info('Bracelet status retrieved', { bracelet_id: req.params.bracelet_id });
    res.json(rows[0]);
  } catch (error) {
    logger.error('Bracelet status retrieval failed', { error: error.message });
    res.status(500).json({ error: 'Failed to get bracelet status' });
  }
});

// PUT /api/bracelets/:bracelet_id/sync - Manual bracelet sync
router.put('/:bracelet_id/sync', authenticateToken, async (req, res) => {
  try {
    await pool.execute(
      'UPDATE bracelets SET last_sync_time = NOW() WHERE bracelet_id = ?',
      [req.params.bracelet_id]
    );
    
    await pool.execute(
      'INSERT INTO sync_logs (bracelet_id, server_id, sync_status, remarks) VALUES (?, ?, ?, ?)',
      [req.params.bracelet_id, 1, 'Success', 'Manual sync requested']
    );
    
    logger.info('Manual bracelet sync completed', { bracelet_id: req.params.bracelet_id });
    res.json({ message: 'Bracelet synchronized successfully' });
  } catch (error) {
    logger.error('Manual bracelet sync failed', { error: error.message });
    res.status(500).json({ error: 'Sync failed' });
  }
});

// POST /api/bracelets/:bracelet_id/deactivate - Deactivate bracelet
router.post('/:bracelet_id/deactivate', authenticateToken, authorizeRole(['Admin', 'Operator']), async (req, res) => {
  try {
    await pool.execute(
      'UPDATE bracelets SET status = ? WHERE bracelet_id = ?',
      ['Inactive', req.params.bracelet_id]
    );
    
    await pool.execute(
      'INSERT INTO sync_logs (bracelet_id, server_id, sync_status, remarks) VALUES (?, ?, ?, ?)',
      [req.params.bracelet_id, 1, 'Success', 'Bracelet deactivated']
    );
    
    logger.info('Bracelet deactivated', { bracelet_id: req.params.bracelet_id });
    res.json({ message: 'Bracelet deactivated successfully' });
  } catch (error) {
    logger.error('Bracelet deactivation failed', { error: error.message });
    res.status(500).json({ error: 'Deactivation failed' });
  }
});

module.exports = router;