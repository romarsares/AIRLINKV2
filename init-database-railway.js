// Railway Database Initialization Script
// Run this once after deployment: node init-database-railway.js

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
    console.log('🚀 Starting Railway database initialization...\n');
    
    try {
        // Connect to MySQL
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });
        
        console.log('✅ Connected to Railway MySQL\n');
        
        // Read SQL file
        const sqlFile = fs.readFileSync(
            path.join(__dirname, 'database', 'reset-complete.sql'),
            'utf8'
        );
        
        console.log('📄 Executing SQL script...\n');
        
        // Execute SQL
        await connection.query(sqlFile);
        
        console.log('✅ Database initialized successfully!\n');
        console.log('📊 Created:');
        console.log('   - 200 bracelets (GES001-GES200)');
        console.log('   - 200 passengers');
        console.log('   - 200 bookings');
        console.log('   - 10 flights');
        console.log('   - 2 users (admin/operator)\n');
        
        await connection.end();
        
        console.log('🎉 Initialization complete!');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

initDatabase();
