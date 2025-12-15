// test-jwt.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'sdn_sukasari_04_def137fff8ea116b34d0f3495ac5ee19beda53d337eafa7b514effd343140638';

// Create test token
const testUser = {
  id: 1,
  name: 'Test Admin',
  email: 'test@example.com',
  role: 'admin'
};

console.log('🔐 Testing JWT with secret:', JWT_SECRET.substring(0, 20) + '...');

// Generate token
const token = jwt.sign(testUser, JWT_SECRET, { expiresIn: '7d' });
console.log('✅ Token generated:', token.substring(0, 50) + '...');

// Verify token
try {
  const verified = jwt.verify(token, JWT_SECRET);
  console.log('✅ Token verified successfully!');
  console.log('📋 Payload:', verified);
} catch (error) {
  console.log('❌ Verification failed:', error.message);
}
