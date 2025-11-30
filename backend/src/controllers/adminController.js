// Database pool used across all controller functions
const { pool } = require('../config/database');
// Logger is used across all controller functions
const logger = require('../config/logger');

const getSystemOverview = async (req, res) => {
  try {
    let overview = {
      total_bookings: 0,
      active_flights: 0,
      active_bracelets: 0,
      recent_syncs: 0,
      timestamp: new Date().toISOString()
    };
    
    try {
      const [bookings] = await pool.execute('SELECT COUNT(*) as total_bookings FROM bookings');
      const [activeFlights] = await pool.execute('SELECT COUNT(*) as active_flights FROM flights WHERE status != "Departed"');
      const [activeBracelets] = await pool.execute('SELECT COUNT(*) as active_bracelets FROM bracelets WHERE status = "Active"');
      const [recentSyncs] = await pool.execute('SELECT COUNT(*) as recent_syncs FROM sync_logs WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR)');
      
      overview = {
        total_bookings: bookings[0].total_bookings,
        active_flights: activeFlights[0].active_flights,
        active_bracelets: activeBracelets[0].active_bracelets,
        recent_syncs: recentSyncs[0].recent_syncs,
        timestamp: new Date().toISOString()
      };
    } catch (dbError) {
      console.log('Database error, using default values:', dbError.message);
    }
    
    logger.info('System overview requested', overview);
    res.json(overview);
    
  } catch (error) {
    logger.error('System overview failed', { error: error.message });
    res.status(500).json({ error: 'Failed to get system overview' });
  }
};

const getSyncLogs = async (req, res) => {
  try {
    const { filter = 'all', limit = 50 } = req.query;
    
    let query = 'SELECT * FROM sync_logs';
    let params = [];
    
    if (filter === 'failed') {
      query += ' WHERE sync_status = ?';
      params.push('Failed');
    }
    
    query += ' ORDER BY timestamp DESC LIMIT ?';
    params.push(parseInt(limit));
    
    const [logs] = await pool.execute(query, params);
    
    logger.info('Sync logs retrieved', { filter, count: logs.length });
    res.json({ logs, filter, count: logs.length });
    
  } catch (error) {
    logger.error('Sync logs retrieval failed', { error: error.message });
    res.status(500).json({ error: 'Failed to retrieve sync logs' });
  }
};

const forceSync = async (req, res) => {
  try {
    // Simulate manual sync operation
    const syncId = Date.now();
    
    await pool.execute(
      'INSERT INTO sync_logs (bracelet_id, server_id, sync_status, remarks) VALUES (?, ?, ?, ?)',
      [null, 1, 'Success', `Manual sync initiated by ${req.user.role} - ID: ${syncId}`]
    );
    
    logger.info('Manual sync initiated', { syncId, user: req.user.role });
    
    res.json({
      message: 'Manual synchronization initiated',
      sync_id: syncId,
      status: 'Success'
    });
    
  } catch (error) {
    logger.error('Manual sync failed', { error: error.message });
    res.status(500).json({ error: 'Manual sync failed' });
  }
};

module.exports = {
  getSystemOverview,
  getSyncLogs,
  forceSync
};