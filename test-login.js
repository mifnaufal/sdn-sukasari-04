const bcrypt = require('bcryptjs');
async function test() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash baru untuk "admin123":', hash);
  const testHash = '$2a$10$XZuRcM9qL2eY5Jq7v8wZX.abcdefghijklmnopqrstuvwxyz123456';
  const isValid = await bcrypt.compare(password, testHash);
  console.log('Password valid?', isValid);
}
test();