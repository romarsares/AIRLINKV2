require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./config/logger');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AirLink Server Running',
    timestamp: new Date().toISOString()
  });
});

// API routes
const apiRoutes = require('./routes/index');
app.use('/api', apiRoutes);

app.listen(PORT, async () => {
  // Test database connection
  await testConnection();
  
  logger.info(`🚀 AirLink Server running on port ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/api/health`);
  
  // Console output for development visibility
  console.log(`🚀 AirLink Server started successfully on port ${PORT}`);
});

module.exports = app;