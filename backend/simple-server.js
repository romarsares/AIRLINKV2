const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server running' });
});

// Admin overview
app.get('/api/admin/overview', (req, res) => {
  res.json({
    total_bookings: 1,
    active_flights: 1,
    active_bracelets: 1,
    recent_syncs: 0,
    timestamp: new Date().toISOString()
  });
});

// Bracelets
app.get('/api/bracelets', (req, res) => {
  res.json({
    bracelets: [
      {
        bracelet_id: 'GES001',
        status: 'Active',
        battery_level: 85,
        last_sync_time: new Date().toISOString(),
        passenger_name: 'Juan Dela Cruz',
        flight_no: 'PR123',
        booking_status: 'Confirmed',
        connection_status: 'Connected'
      }
    ],
    count: 1
  });
});

// Auth login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if ((username === 'admin' && password === 'admin12354') || 
      (username === 'operator' && password === 'operator123')) {
    res.json({
      success: true,
      token: 'fake-jwt-token',
      username: username,
      role: username === 'admin' ? 'Admin' : 'Operator'
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Simple AirLink Server running on port ${PORT}`);
});