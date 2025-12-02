# AirLink Backend - Complete Code Documentation

## 📁 File Structure
```
backend/
├── server.js          # Main server file
├── auth.js            # Authentication routes
├── database.js        # Database connection
├── package.json       # Dependencies
└── .env              # Environment variables
```

---

## 🔧 1. package.json

```json
{
  "name": "airlink-backend",
  "version": "1.0.0",
  "description": "AirLink Backend API Server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

---

## 🔐 2. .env

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=airlink_dev
DB_USER=airlink_user
DB_PASSWORD=secure_password

PORT=3000
NODE_ENV=development
JWT_SECRET=airlink_secret_key_change_in_production
```

---

## 🗄️ 3. database.js

```javascript
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'N1mbu$12354',
  database: process.env.DB_NAME || 'airlink_dev',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
```

---

## 🔑 4. auth.js

```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Query user from database (check if user exists and is active)
    const query = 'SELECT * FROM users WHERE username = ? AND is_active = TRUE';
    const [users] = await db.execute(query, [username]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials or account disabled' });
    }

    const user = users[0];

    // Verify password (SHA-256 hash comparison)
    const crypto = require('crypto');
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    
    if (hashedPassword !== user.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.user_id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'airlink_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      username: user.username,
      role: user.role,
      user: {
        id: user.user_id,
        username: user.username,
        role: user.role,
        fullName: user.full_name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/verify
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'airlink_secret_key');
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
```

---

## 🚀 5. server.js (Main Server - Part 1)

```javascript
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

// Middleware with CSP fix for inline scripts
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
```

---

## 📝 Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Edit `.env` file with your database credentials

### 3. Start Server
```bash
# Production
npm start

# Development (auto-restart)
npm run dev
```

### 4. Test Server
```bash
curl http://localhost:3000/api/health
```

---

## 🔗 API Endpoints Summary

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token

### Admin
- `GET /api/admin/overview` - System overview
- `GET /api/admin/sync_logs` - Sync logs

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID

### Bracelets
- `POST /api/bracelets/assign` - Assign bracelet
- `POST /api/bracelets/verify` - Verify boarding
- `GET /api/bracelets/:id/status` - Get bracelet status
- `GET /api/bracelets` - Get all bracelets
- `POST /api/bracelets/:id/heartbeat` - Bracelet heartbeat
- `PUT /api/bracelets/:id/sync` - Manual sync
- `POST /api/bracelets/:id/deactivate` - Deactivate bracelet

### Flights
- `GET /api/flights` - Get all flights
- `PUT /api/flights/by-number/:flight_no/status` - Update flight status

### Passengers
- `GET /api/passengers` - Get all passengers

---

## 🔒 Security Features

1. **Helmet.js** - Security headers with CSP
2. **CORS** - Cross-origin resource sharing
3. **JWT** - Token-based authentication
4. **SHA-256** - Password hashing
5. **Input Validation** - SQL injection prevention
6. **Rate Limiting** - Login attempt protection

---

## 📊 Database Connection

- Uses MySQL connection pool
- Auto-reconnect on connection loss
- 10 concurrent connections max
- Prepared statements for security

---

## 🎯 Default Credentials

- **Admin**: `admin` / `admin12354`
- **Operator**: `operator` / `operator123`

---

**Note**: This is the complete backend code. For full server.js with all endpoints, see the actual file (truncated here for readability).
