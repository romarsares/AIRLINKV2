const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Auth login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if ((username === 'admin' && password === 'admin12354') || 
      (username === 'operator' && password === 'operator123')) {
    res.json({
      success: true,
      token: 'demo-token-' + Date.now(),
      username: username,
      role: username === 'admin' ? 'Admin' : 'Operator'
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Overview endpoint
app.get('/api/admin/overview', (req, res) => {
  res.json({
    total_bookings: 5,
    active_flights: 3,
    active_bracelets: 2,
    recent_syncs: 1,
    timestamp: new Date().toISOString()
  });
});

// Bracelets endpoint
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
      },
      {
        bracelet_id: 'GES002',
        status: 'Inactive',
        battery_level: 92,
        last_sync_time: new Date(Date.now() - 300000).toISOString(),
        passenger_name: null,
        flight_no: null,
        booking_status: null,
        connection_status: 'Disconnected'
      }
    ],
    count: 2
  });
});

app.listen(3000, () => {
  console.log('🚀 AirLink Demo Server running on port 3000');
  console.log('Ready for presentation!');
});