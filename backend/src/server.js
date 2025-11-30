require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'airlink_dev',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AirLink Server Running' });
});

// Auth login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE username = ? AND password_hash = SHA2(?, 256)',
      [username, password]
    );
    
    if (users.length > 0) {
      res.json({
        success: true,
        token: 'jwt-token-' + Date.now(),
        username: users[0].username,
        role: users[0].role === 'admin' ? 'Admin' : 'Operator'
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin overview
app.get('/api/admin/overview', async (req, res) => {
  try {
    const [bookings] = await pool.execute('SELECT COUNT(*) as count FROM bookings');
    const [flights] = await pool.execute('SELECT COUNT(*) as count FROM flights WHERE status != "Departed"');
    const [bracelets] = await pool.execute('SELECT COUNT(*) as count FROM bracelets WHERE status = "Active"');
    const [syncs] = await pool.execute('SELECT COUNT(*) as count FROM sync_logs WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR)');
    
    res.json({
      total_bookings: bookings[0].count,
      active_flights: flights[0].count,
      active_bracelets: bracelets[0].count,
      recent_syncs: syncs[0].count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Overview error:', error);
    res.json({
      total_bookings: 0,
      active_flights: 0,
      active_bracelets: 0,
      recent_syncs: 0,
      timestamp: new Date().toISOString()
    });
  }
});

// Bracelets
app.get('/api/bracelets', async (req, res) => {
  try {
    const [bracelets] = await pool.execute(`
      SELECT 
        b.bracelet_id,
        b.status,
        b.battery_level,
        b.last_sync_time,
        p.name as passenger_name,
        f.flight_no,
        bk.booking_status,
        CASE 
          WHEN b.last_sync_time > DATE_SUB(NOW(), INTERVAL 5 MINUTE) THEN 'Connected'
          ELSE 'Disconnected'
        END as connection_status
      FROM bracelets b
      LEFT JOIN bookings bk ON b.bracelet_id = bk.assigned_bracelet
      LEFT JOIN passengers p ON bk.passenger_id = p.passenger_id
      LEFT JOIN flights f ON bk.flight_id = f.flight_id
      ORDER BY b.last_sync_time DESC
    `);
    
    res.json({ bracelets, count: bracelets.length });
  } catch (error) {
    console.error('Bracelets error:', error);
    res.json({ bracelets: [], count: 0 });
  }
});

app.listen(PORT, async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
  console.log(`🚀 AirLink Server running on port ${PORT}`);
});

module.exports = app;