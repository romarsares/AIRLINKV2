require('dotenv').config({ path: '.env' });
// JWT module is always needed for this utility script
const jwt = require('jsonwebtoken');

// Generate test JWT tokens for AirLink API testing

const adminToken = jwt.sign(
  { 
    user_id: 1, 
    role: 'Admin',
    email: 'admin@airlink.com'
  },
  process.env.JWT_SECRET || 'airlink_jwt_secret_2024_secure_key',
  { expiresIn: '24h' }
);

const operatorToken = jwt.sign(
  { 
    user_id: 2, 
    role: 'Operator',
    email: 'operator@airlink.com'
  },
  process.env.JWT_SECRET || 'airlink_jwt_secret_2024_secure_key',
  { expiresIn: '24h' }
);

console.log('\n🔑 AirLink JWT Tokens for API Testing:\n');
console.log('📋 ADMIN TOKEN (copy this):');
console.log(adminToken);
console.log('\n📋 OPERATOR TOKEN (copy this):');
console.log(operatorToken);

console.log('\n📖 Usage Examples:');
console.log('curl -H "Authorization: Bearer ' + adminToken + '" http://localhost:3002/api/admin/overview');
console.log('\ncurl -H "Authorization: Bearer ' + operatorToken + '" http://localhost:3002/api/bracelets/assign');