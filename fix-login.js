const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
async function fixLogin() {
  console.log('🔧 MULAI PERBAIKAN LOGIN...\n');
  console.log('1. Generating hash untuk password "123"...');
  const password = '123';
  const salt = await bcrypt.genSalt(10);
  const correctHash = await bcrypt.hash(password, salt);
  console.log('   ✅ Hash baru:', correctHash);
  console.log('\n2. Testing hash...');
  const isValid = await bcrypt.compare(password, correctHash);
  console.log('   ✅ Password "123" valid?', isValid);
  if (!isValid) {
    console.log('   ❌ Hash masih invalid, coba metode lain...');
    const hash2 = await bcrypt.hash(password, 10);
    console.log('   Hash alternatif:', hash2);
    const isValid2 = await bcrypt.compare(password, hash2);
    console.log('   Valid?', isValid2);
  }
  console.log('\n3. SQL untuk update database:');
  console.log(`
USE sdn_sukasari_04_final;
UPDATE users 
SET password = '${correctHash}'
WHERE email = 'admin@sukasari04.sch.id';
-- Verifikasi
SELECT email, LEFT(password, 30) as hash_preview FROM users;
  `);
  console.log('\n🎯 COPY hash di atas dan jalankan di MySQL!');
}
fixLogin().catch(console.error);