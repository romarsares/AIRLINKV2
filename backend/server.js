const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./auth');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  }
}));
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));
app.use('/bracelet', express.static(path.join(__dirname, '../bracelet')));

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/frontend/src/index.html');
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'airlink_secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AirLink API Server Running' });
});

// Admin overview
app.get('/api/admin/overview', async (req, res) => {
  try {
    const [bookings] = await db.execute('SELECT COUNT(*) as total FROM bookings');
    const [bracelets] = await db.execute('SELECT COUNT(*) as total FROM bracelets WHERE status = "Active"');
    const [connected] = await db.execute('SELECT COUNT(*) as total FROM bracelets WHERE last_sync_time > DATE_SUB(NOW(), INTERVAL 30 SECOND)');
    const [flights] = await db.execute('SELECT COUNT(*) as total FROM flights');
    const [syncLogs] = await db.execute('SELECT COUNT(*) as total FROM sync_logs WHERE DATE(timestamp) = CURDATE()');

    res.json({
      totalBookings: bookings[0].total,
      activeBracelets: bracelets[0].total,
      connectedBracelets: connected[0].total,
      todayFlights: flights[0].total,
      todaySyncs: syncLogs[0].total
    });
  } catch (error) {
    console.error('Overview error:', error);
    res.status(500).json({ error: 'Failed to fetch overview data' });
  }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { passenger_name, flight_no, seat_no, departure_time } = req.body;
    
    // Insert passenger if not exists
    const [passengerResult] = await db.execute(
      'INSERT IGNORE INTO passengers (name) VALUES (?)',
      [passenger_name]
    );
    
    // Get passenger ID
    const [passenger] = await db.execute(
      'SELECT passenger_id FROM passengers WHERE name = ?',
      [passenger_name]
    );
    
    // Get flight ID
    const [flight] = await db.execute(
      'SELECT flight_id FROM flights WHERE flight_no = ?',
      [flight_no]
    );
    
    if (flight.length === 0) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    
    // Create booking
    const [result] = await db.execute(
      'INSERT INTO bookings (passenger_id, flight_id, seat_no, booking_status) VALUES (?, ?, ?, ?)',
      [passenger[0].passenger_id, flight[0].flight_id, seat_no, 'Confirmed']
    );
    
    res.status(201).json({
      booking_id: result.insertId,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const [bookings] = await db.execute(`
      SELECT b.*, p.name as passenger_name, f.flight_no, f.destination, f.departure_time, f.gate_no
      FROM bookings b
      JOIN passengers p ON b.passenger_id = p.passenger_id
      JOIN flights f ON b.flight_id = f.flight_id
      ORDER BY b.booking_id DESC
    `);
    
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking
app.get('/api/bookings/:id', async (req, res) => {
  try {
    const [booking] = await db.execute(`
      SELECT b.*, p.name as passenger_name, f.flight_no, f.destination, f.departure_time, f.gate_no
      FROM bookings b
      JOIN passengers p ON b.passenger_id = p.passenger_id
      JOIN flights f ON b.flight_id = f.flight_id
      WHERE b.booking_id = ?
    `, [req.params.id]);
    
    if (booking.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking[0]);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Assign bracelet
app.post('/api/bracelets/assign', async (req, res) => {
  try {
    const { booking_id, bracelet_id } = req.body;
    
    // Check bracelet connection status
    const [bracelet] = await db.execute(
      'SELECT *, CASE WHEN last_sync_time > DATE_SUB(NOW(), INTERVAL 30 SECOND) THEN "Connected" ELSE "Disconnected" END as connection_status FROM bracelets WHERE bracelet_id = ?',
      [bracelet_id]
    );
    
    if (bracelet.length === 0) {
      return res.status(404).json({ error: 'Bracelet not found' });
    }
    
    // Check if bracelet is currently assigned to any booking
    const [currentAssignment] = await db.execute(
      'SELECT booking_id FROM bookings WHERE assigned_bracelet = ?',
      [bracelet_id]
    );
    
    if (currentAssignment.length > 0) {
      return res.status(400).json({ error: 'Bracelet already assigned to another passenger' });
    }
    
    if (bracelet[0].connection_status === 'Disconnected') {
      return res.status(400).json({ error: 'Bracelet not connected to server' });
    }
    
    // Update booking with bracelet
    await db.execute(
      'UPDATE bookings SET assigned_bracelet = ? WHERE booking_id = ?',
      [bracelet_id, booking_id]
    );
    
    // Activate bracelet
    await db.execute(
      'UPDATE bracelets SET status = "Active", last_sync_time = NOW() WHERE bracelet_id = ?',
      [bracelet_id]
    );
    
    res.json({ message: 'Bracelet assigned successfully' });
  } catch (error) {
    console.error('Assign bracelet error:', error);
    res.status(500).json({ error: 'Failed to assign bracelet' });
  }
});

// Verify bracelet
app.post('/api/bracelets/verify', async (req, res) => {
  try {
    const { bracelet_id, gate_no, collect_bracelet } = req.body;
    
    // Get booking info
    const [booking] = await db.execute(`
      SELECT b.*, f.gate_no as flight_gate, f.flight_no, p.name as passenger_name
      FROM bookings b
      JOIN flights f ON b.flight_id = f.flight_id
      JOIN passengers p ON b.passenger_id = p.passenger_id
      WHERE b.assigned_bracelet = ? AND b.booking_status = 'Confirmed'
    `, [bracelet_id]);
    
    if (booking.length === 0) {
      await db.execute(
        'INSERT INTO sync_logs (bracelet_id, timestamp, sync_status, remarks) VALUES (?, NOW(), ?, ?)',
        [bracelet_id, 'Failed', 'Bracelet not found or not confirmed']
      );
      
      return res.status(400).json({ 
        verified: false, 
        message: 'Bracelet not found or booking not confirmed' 
      });
    }
    
    const bookingData = booking[0];
    
    if (bookingData.flight_gate && gate_no !== bookingData.flight_gate) {
      await db.execute(
        'INSERT INTO sync_logs (bracelet_id, timestamp, sync_status, remarks) VALUES (?, NOW(), ?, ?)',
        [bracelet_id, 'Failed', `Wrong gate: expected ${bookingData.flight_gate}, got ${gate_no}`]
      );
      
      return res.status(400).json({ 
        verified: false, 
        message: `Wrong gate! Expected: ${bookingData.flight_gate}, Current: ${gate_no}`,
        expected_gate: bookingData.flight_gate,
        current_gate: gate_no
      });
    }
    
    await db.execute(
      'UPDATE bookings SET booking_status = "Boarded" WHERE booking_id = ?',
      [bookingData.booking_id]
    );
    
    await db.execute(
      'INSERT INTO sync_logs (bracelet_id, timestamp, sync_status, remarks) VALUES (?, NOW(), ?, ?)',
      [bracelet_id, 'Success', `Boarding verified at gate ${gate_no}`]
    );
    
    if (collect_bracelet) {
      await db.execute(
        'UPDATE bookings SET assigned_bracelet = NULL WHERE booking_id = ?',
        [bookingData.booking_id]
      );
      
      await db.execute(
        'UPDATE bracelets SET status = "Inactive" WHERE bracelet_id = ?',
        [bracelet_id]
      );
      
      await db.execute(
        'INSERT INTO sync_logs (bracelet_id, timestamp, sync_status, remarks) VALUES (?, NOW(), ?, ?)',
        [bracelet_id, 'Success', 'Bracelet collected after boarding']
      );
    }
    
    res.json({ 
      verified: true, 
      message: collect_bracelet ? 'Boarding Approved - Bracelet Collected' : 'Boarding Approved',
      flight_no: bookingData.flight_no,
      passenger_name: bookingData.passenger_name,
      gate_no: gate_no,
      bracelet_collected: collect_bracelet || false
    });
  } catch (error) {
    console.error('Verify bracelet error:', error);
    res.status(500).json({ error: 'Failed to verify bracelet' });
  }
});

// Get bracelet status with flight info
app.get('/api/bracelets/:id/status', async (req, res) => {
  try {
    const [bracelet] = await db.execute(`
      SELECT br.*, b.booking_status, p.name as passenger_name, f.flight_no, f.gate_no, f.departure_time, f.destination, f.status as flight_status, b.seat_no,
             TIMESTAMPDIFF(MINUTE, NOW(), f.departure_time) as minutes_until_departure
      FROM bracelets br
      LEFT JOIN bookings b ON br.bracelet_id = b.assigned_bracelet
      LEFT JOIN passengers p ON b.passenger_id = p.passenger_id
      LEFT JOIN flights f ON b.flight_id = f.flight_id
      WHERE br.bracelet_id = ?
    `, [req.params.id]);
    
    if (bracelet.length === 0) {
      return res.status(404).json({ error: 'Bracelet not found' });
    }
    
    res.json({ data: bracelet[0] });
  } catch (error) {
    console.error('Get bracelet status error:', error);
    res.status(500).json({ error: 'Failed to fetch bracelet status' });
  }
});

// Get all bracelets with connection status
app.get('/api/bracelets', async (req, res) => {
  try {
    const [bracelets] = await db.execute(`
      SELECT br.*, 
             CASE WHEN br.last_sync_time > DATE_SUB(NOW(), INTERVAL 30 SECOND) 
                  THEN 'Connected' ELSE 'Disconnected' END as connection_status,
             b.booking_id, b.booking_status, p.name as passenger_name, f.flight_no
      FROM bracelets br
      LEFT JOIN bookings b ON br.bracelet_id = b.assigned_bracelet
      LEFT JOIN passengers p ON b.passenger_id = p.passenger_id
      LEFT JOIN flights f ON b.flight_id = f.flight_id
      ORDER BY br.last_sync_time DESC
    `);
    
    res.json(bracelets);
  } catch (error) {
    console.error('Get bracelets error:', error);
    res.status(500).json({ error: 'Failed to fetch bracelets' });
  }
});

// Get all passengers
app.get('/api/passengers', async (req, res) => {
  try {
    const [passengers] = await db.execute(`
      SELECT p.*, b.booking_id, b.seat_no, b.booking_status, b.assigned_bracelet,
             f.flight_no, f.destination, f.departure_time, f.gate_no
      FROM passengers p
      LEFT JOIN bookings b ON p.passenger_id = b.passenger_id
      LEFT JOIN flights f ON b.flight_id = f.flight_id
      ORDER BY p.name
    `);
    
    res.json(passengers);
  } catch (error) {
    console.error('Get passengers error:', error);
    res.status(500).json({ error: 'Failed to fetch passengers' });
  }
});

// Get all flights with passenger counts
app.get('/api/flights', async (req, res) => {
  try {
    const [flights] = await db.execute(`
      SELECT f.*,
             COUNT(b.booking_id) as total_passengers,
             COUNT(CASE WHEN b.booking_status = 'Boarded' THEN 1 END) as boarded_count,
             COUNT(CASE WHEN b.booking_status = 'Missed' THEN 1 END) as missed_count,
             COUNT(CASE WHEN b.booking_status = 'Cancelled' THEN 1 END) as cancelled_count
      FROM flights f
      LEFT JOIN bookings b ON f.flight_id = b.flight_id
      GROUP BY f.flight_id
      ORDER BY f.departure_time
    `);
    
    res.json(flights);
  } catch (error) {
    console.error('Get flights error:', error);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

// Sync logs
app.get('/api/admin/sync_logs', async (req, res) => {
  try {
    const filter = req.query.filter || 'all';
    let whereClause = '';
    
    if (filter === 'today') {
      whereClause = 'WHERE DATE(timestamp) = CURDATE()';
    } else if (filter === 'failed') {
      whereClause = 'WHERE sync_status = "Failed"';
    }
    
    const [logs] = await db.execute(`
      SELECT * FROM sync_logs ${whereClause} ORDER BY timestamp DESC LIMIT 100
    `);
    
    res.json({ logs });
  } catch (error) {
    console.error('Sync logs error:', error);
    res.status(500).json({ error: 'Failed to fetch sync logs' });
  }
});

// Collect bracelet (unassign and deactivate after boarding)
app.post('/api/bracelets/:id/collect', async (req, res) => {
  try {
    const braceletId = req.params.id;
    
    const [booking] = await db.execute(
      'SELECT booking_id, booking_status FROM bookings WHERE assigned_bracelet = ?',
      [braceletId]
    );
    
    if (booking.length === 0) {
      return res.status(400).json({ error: 'Bracelet not assigned to any passenger' });
    }
    
    if (booking[0].booking_status !== 'Boarded') {
      return res.status(400).json({ error: 'Passenger has not boarded yet' });
    }
    
    await db.execute(
      'UPDATE bookings SET assigned_bracelet = NULL WHERE booking_id = ?',
      [booking[0].booking_id]
    );
    
    await db.execute(
      'UPDATE bracelets SET status = "Inactive" WHERE bracelet_id = ?',
      [braceletId]
    );
    
    await db.execute(
      'INSERT INTO sync_logs (bracelet_id, timestamp, sync_status, remarks) VALUES (?, NOW(), ?, ?)',
      [braceletId, 'Success', 'Bracelet collected after boarding']
    );
    
    res.json({ message: 'Bracelet collected and ready for reuse' });
  } catch (error) {
    console.error('Collect bracelet error:', error);
    res.status(500).json({ error: 'Failed to collect bracelet' });
  }
});

// Deactivate bracelet
app.post('/api/bracelets/:id/deactivate', async (req, res) => {
  try {
    // Clear bracelet assignment from bookings
    await db.execute(
      'UPDATE bookings SET assigned_bracelet = NULL WHERE assigned_bracelet = ?',
      [req.params.id]
    );
    
    // Set bracelet status to Inactive
    await db.execute(
      'UPDATE bracelets SET status = "Inactive" WHERE bracelet_id = ?',
      [req.params.id]
    );
    
    res.json({ message: 'Bracelet deactivated successfully' });
  } catch (error) {
    console.error('Deactivate bracelet error:', error);
    res.status(500).json({ error: 'Failed to deactivate bracelet' });
  }
});

// Manual sync
app.put('/api/bracelets/:id/sync', async (req, res) => {
  try {
    await db.execute(
      'UPDATE bracelets SET last_sync_time = NOW() WHERE bracelet_id = ?',
      [req.params.id]
    );
    
    await db.execute(
      'INSERT INTO sync_logs (bracelet_id, timestamp, sync_status, remarks) VALUES (?, NOW(), ?, ?)',
      [req.params.id, 'Success', 'Manual sync triggered']
    );
    
    res.json({ message: 'Manual sync completed' });
  } catch (error) {
    console.error('Manual sync error:', error);
    res.status(500).json({ error: 'Failed to sync bracelet' });
  }
});

// Force sync all
app.post('/api/sync/force', async (req, res) => {
  try {
    await db.execute('UPDATE bracelets SET last_sync_time = NOW() WHERE status = "Active"');
    
    const [activeBracelets] = await db.execute('SELECT bracelet_id FROM bracelets WHERE status = "Active"');
    
    for (const bracelet of activeBracelets) {
      await db.execute(
        'INSERT INTO sync_logs (bracelet_id, timestamp, sync_status, remarks) VALUES (?, NOW(), ?, ?)',
        [bracelet.bracelet_id, 'Success', 'Force sync all triggered']
      );
    }
    
    res.json({ 
      message: 'Force sync completed',
      synced_count: activeBracelets.length
    });
  } catch (error) {
    console.error('Force sync error:', error);
    res.status(500).json({ error: 'Failed to force sync' });
  }
});

// Bracelet heartbeat with notification check
app.post('/api/bracelets/:id/heartbeat', async (req, res) => {
  try {
    await db.execute(
      'UPDATE bracelets SET last_sync_time = NOW() WHERE bracelet_id = ?',
      [req.params.id]
    );
    
    // Check for pending notifications
    const [notifications] = await db.execute(
      'SELECT * FROM notifications WHERE bracelet_id = ? AND is_read = FALSE ORDER BY created_at DESC LIMIT 5',
      [req.params.id]
    );
    
    // Check for boarding reminders
    const [flightInfo] = await db.execute(`
      SELECT f.flight_no, f.gate_no, f.departure_time, f.status,
             TIMESTAMPDIFF(MINUTE, NOW(), f.departure_time) as minutes_until_departure
      FROM bookings b
      JOIN flights f ON b.flight_id = f.flight_id
      WHERE b.assigned_bracelet = ? AND b.booking_status = 'Confirmed'
    `, [req.params.id]);
    
    let boardingReminder = null;
    if (flightInfo.length > 0) {
      const flight = flightInfo[0];
      const minutesUntil = flight.minutes_until_departure;
      
      if (minutesUntil <= 15 && minutesUntil > 0) {
        boardingReminder = {
          type: 'BOARDING_REMINDER',
          message: `Proceed to Gate ${flight.gate_no} - Departure in ${minutesUntil} min`,
          flight_no: flight.flight_no,
          gate_no: flight.gate_no,
          minutes_until: minutesUntil
        };
      }
    }
    
    res.json({ 
      message: 'Heartbeat received',
      notifications: notifications,
      boarding_reminder: boardingReminder
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update heartbeat' });
  }
});

// Get current gate session
app.get('/api/gates/session/:scanner_ip', async (req, res) => {
  try {
    const [session] = await db.execute(
      'SELECT gate_no FROM gate_sessions WHERE scanner_ip = ? AND status = "Active" ORDER BY assigned_at DESC LIMIT 1',
      [req.params.scanner_ip]
    );
    
    if (session.length > 0) {
      res.json({ gate_no: session[0].gate_no });
    } else {
      res.json({ gate_no: null });
    }
  } catch (error) {
    console.error('Get gate session error:', error);
    res.status(500).json({ error: 'Failed to get gate session' });
  }
});

// Get connected bracelets
app.get('/api/bracelets/connected', async (req, res) => {
  try {
    const [bracelets] = await db.execute(`
      SELECT br.*, 
             CASE WHEN br.last_sync_time > DATE_SUB(NOW(), INTERVAL 30 SECOND) 
                  THEN 'Connected' ELSE 'Disconnected' END as connection_status,
             b.booking_id, p.name as passenger_name, f.flight_no
      FROM bracelets br
      LEFT JOIN bookings b ON br.bracelet_id = b.assigned_bracelet
      LEFT JOIN passengers p ON b.passenger_id = p.passenger_id
      LEFT JOIN flights f ON b.flight_id = f.flight_id
      ORDER BY br.last_sync_time DESC
    `);
    res.json(bracelets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch connected bracelets' });
  }
});

// Get available gates
app.get('/api/gates', async (req, res) => {
  try {
    const [gates] = await db.execute(`
      SELECT gate_no, terminal, status FROM gates 
      WHERE status = 'Active' 
      ORDER BY terminal, gate_no
    `);
    
    res.json(gates);
  } catch (error) {
    console.error('Get gates error:', error);
    res.status(500).json({ error: 'Failed to fetch gates' });
  }
});

// Get notifications for bracelet
app.get('/api/bracelets/:id/notifications', async (req, res) => {
  try {
    const [notifications] = await db.execute(
      'SELECT * FROM notifications WHERE bracelet_id = ? AND is_read = FALSE ORDER BY created_at DESC LIMIT 10',
      [req.params.id]
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
app.put('/api/notifications/:id/read', async (req, res) => {
  try {
    await db.execute(
      'UPDATE notifications SET is_read = TRUE, delivered_at = NOW() WHERE notification_id = ?',
      [req.params.id]
    );
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Send notification to bracelet
app.post('/api/notifications/send', async (req, res) => {
  try {
    const { bracelet_id, notification_type, message, priority } = req.body;
    
    const [result] = await db.execute(
      'INSERT INTO notifications (bracelet_id, notification_type, message, priority) VALUES (?, ?, ?, ?)',
      [bracelet_id, notification_type, message, priority || 'Normal']
    );
    
    res.json({ 
      message: 'Notification sent',
      notification_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Update flight status by flight_id
app.put('/api/flights/:id/status', async (req, res) => {
    const { id } = req.params;
    const { gate_no, status, delay_minutes, reason } = req.body;

    try {
        await db.query(
            `UPDATE flights 
             SET gate_no = ?, status = ?, delay_minutes = ?, 
                 cancellation_reason = ?
             WHERE flight_id = ?`,
            [gate_no, status, delay_minutes, reason, id]
        );

        const [passengers] = await db.query(
            `SELECT b.assigned_bracelet as bracelet_id
             FROM bookings b 
             WHERE b.flight_id = ? AND b.assigned_bracelet IS NOT NULL`,
            [id]
        );

        let notificationMessage = status === 'Delayed' 
            ? `Flight Delayed: ${delay_minutes} min. Gate: ${gate_no}`
            : status === 'Cancelled' 
            ? `Flight Cancelled: ${reason}`
            : `Gate Changed to ${gate_no}`;

        for (const p of passengers) {
            await db.query(
                `INSERT INTO notifications (bracelet_id, notification_type, message, created_at)
                 VALUES (?, 'GATE_CHANGE', ?, NOW())`,
                [p.bracelet_id, notificationMessage]
            );
        }

        res.json({
            success: true,
            notifications_sent: passengers.length
        });

    } catch (error) {
        console.error('Error updating flight:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Check and mark missed flights
app.post('/api/flights/check-missed', async (req, res) => {
  try {
    const [missedPassengers] = await db.execute(`SELECT b.booking_id, b.assigned_bracelet, p.name as passenger_name, f.flight_no
      FROM bookings b JOIN passengers p ON b.passenger_id = p.passenger_id JOIN flights f ON b.flight_id = f.flight_id
      WHERE f.status = 'Departed' AND b.booking_status = 'Confirmed' AND b.assigned_bracelet IS NOT NULL`);
    
    for (const passenger of missedPassengers) {
      await db.execute('UPDATE bookings SET booking_status = "Missed" WHERE booking_id = ?', [passenger.booking_id]);
      await db.execute('INSERT INTO notifications (bracelet_id, notification_type, message, priority) VALUES (?, ?, ?, ?)',
        [passenger.assigned_bracelet, 'MISSED_FLIGHT', `You missed flight ${passenger.flight_no}. Please contact airline.`, 'High']);
    }
    
    res.json({ message: 'Missed flights checked', passengers_marked: missedPassengers.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check missed flights' });
  }
});

// Auto-depart flights that passed departure time
app.post('/api/flights/auto-depart', async (req, res) => {
  try {
    const [pastFlights] = await db.execute(`SELECT flight_id, flight_no FROM flights WHERE departure_time < NOW() AND status IN ('Scheduled', 'Boarding')`);
    let totalMissed = 0;
    for (const flight of pastFlights) {
      await db.execute('UPDATE flights SET status = "Departed" WHERE flight_id = ?', [flight.flight_id]);
      const [passengers] = await db.execute(`SELECT b.booking_id, b.assigned_bracelet FROM bookings b WHERE b.flight_id = ? AND b.booking_status = 'Confirmed' AND b.assigned_bracelet IS NOT NULL`, [flight.flight_id]);
      for (const passenger of passengers) {
        await db.execute('UPDATE bookings SET booking_status = "Missed" WHERE booking_id = ?', [passenger.booking_id]);
        await db.execute('INSERT INTO notifications (bracelet_id, notification_type, message, priority) VALUES (?, ?, ?, ?)', [passenger.assigned_bracelet, 'MISSED_FLIGHT', `Flight ${flight.flight_no} has departed. You missed your flight.`, 'High']);
        totalMissed++;
      }
    }
    res.json({ message: 'Auto-depart completed', flights_departed: pastFlights.length, passengers_missed: totalMissed });
  } catch (error) {
    res.status(500).json({ error: 'Failed to auto-depart flights' });
  }
});

// Change gate session
app.post('/api/gates/session', async (req, res) => {
  try {
    const { gate_no, admin_password, scanner_ip } = req.body;
    
    // Validate admin password
    const [admin] = await db.execute(
      'SELECT * FROM users WHERE username = "admin" AND password_hash = SHA2(?, 256)',
      [admin_password]
    );
    
    if (admin.length === 0) {
      return res.status(401).json({ error: 'Invalid admin password' });
    }
    
    // Validate gate exists
    const [gate] = await db.execute(
      'SELECT * FROM gates WHERE gate_no = ? AND status = "Active"',
      [gate_no]
    );
    
    if (gate.length === 0) {
      return res.status(404).json({ error: 'Gate not found or inactive' });
    }
    
    // Delete existing sessions for this scanner to avoid constraint issues
    await db.execute(
      'DELETE FROM gate_sessions WHERE scanner_ip = ?',
      [scanner_ip]
    );
    
    // Create new gate session
    await db.execute(
      'INSERT INTO gate_sessions (gate_no, scanner_ip, assigned_by, status) VALUES (?, ?, ?, "Active")',
      [gate_no, scanner_ip, 'admin']
    );
    
    res.json({ 
      message: `Gate session changed to ${gate_no} successfully`,
      gate_no: gate_no
    });
  } catch (error) {
    console.error('Change gate session error:', error);
    res.status(500).json({ error: 'Failed to change gate session' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AirLink Backend Server running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}/api/health`);
  console.log(`Network: http://<YOUR_IP>:${PORT}/api/health`);
});

module.exports = app;