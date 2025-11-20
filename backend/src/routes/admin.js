// Express router for admin endpoints
const express = require('express');
const router = express.Router();
// Admin controller functions used in all routes
const { getSystemOverview, getSyncLogs, forceSync } = require('../controllers/adminController');
// Auth middleware used across all admin routes
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET /api/admin/overview - System overview dashboard
router.get('/overview', (req, res, next) => {
  console.log('Admin overview route hit');
  next();
}, getSystemOverview);

// GET /api/sync_logs - Retrieve sync logs
router.get('/sync_logs', authenticateToken, authorizeRole(['Admin']), getSyncLogs);

// POST /api/sync/force - Force manual server sync
router.post('/sync/force', authenticateToken, authorizeRole(['Admin']), forceSync);

module.exports = router;