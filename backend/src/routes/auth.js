// Express router for authentication endpoints
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
// Crypto module used for password hashing verification
const crypto = require('crypto');
// JWT module used for token generation
const jwt = require('jsonwebtoken');
// Database pool used for user authentication queries
const { pool } = require('../config/database');
const logger = require('../config/logger');

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: { error: 'Too many login attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false
});

// Input validation function
const validateLoginInput = (username, password, role) => {
    const errors = [];
    
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
        errors.push('Valid username is required');
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }
    if (!role || !['Admin', 'Operator'].includes(role)) {
        errors.push('Valid role is required');
    }
    
    return errors;
};

// POST /api/auth/login - Authenticate user against MySQL database
router.post('/login', loginLimiter, async (req, res) => {
    const startTime = Date.now();
    let connection;
    
    try {
        const { username, password, role } = req.body;
        const clientIP = req.ip || req.connection.remoteAddress;

        // Input validation
        const validationErrors = validateLoginInput(username, password, role);
        if (validationErrors.length > 0) {
            logger.warn(`Login validation failed from ${clientIP}: ${validationErrors.join(', ')}`);
            return res.status(400).json({ error: 'Invalid input data' });
        }

        // Sanitize username
        const sanitizedUsername = username.trim().toLowerCase();

        // Hash the provided password
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Get database connection
        connection = await pool.getConnection();
        
        // Query MySQL database for user with prepared statement
        const [rows] = await connection.execute(
            'SELECT user_id, username, password_hash, role FROM users WHERE LOWER(username) = ? AND is_active = TRUE',
            [sanitizedUsername]
        );
        
        // Verify password and role
        if (rows.length === 0 || rows[0].password_hash !== hashedPassword || rows[0].role !== role) {
            logger.warn(`Failed login attempt from ${clientIP} for user: ${sanitizedUsername}`);
            // Consistent response time to prevent timing attacks
            await new Promise(resolve => setTimeout(resolve, 1000));
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = rows[0];

        // Generate JWT token with secure settings
        const token = jwt.sign(
            { 
                user_id: user.user_id, 
                username: user.username, 
                role: user.role,
                iat: Math.floor(Date.now() / 1000)
            },
            process.env.JWT_SECRET || 'airlink_secret_key',
            { 
                expiresIn: '8h',
                issuer: 'airlink-system',
                audience: 'airlink-dashboard'
            }
        );

        // Log successful login
        logger.info(`Successful login from ${clientIP} for user: ${user.username} (${user.role})`);

        // Set secure headers
        res.set({
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block'
        });

        res.json({
            success: true,
            token: token,
            role: user.role,
            username: user.username,
            expiresIn: '8h'
        });

    } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`Login error (${duration}ms): ${error.message}`, {
            error: error.stack,
            ip: req.ip
        });
        
        // Generic error response to prevent information leakage
        res.status(500).json({ error: 'Authentication service temporarily unavailable' });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// Logout endpoint to invalidate tokens (client-side)
router.post('/logout', (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    logger.info(`Logout request from ${clientIP}`);
    
    res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;