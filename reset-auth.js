const fs = require('fs');
const path = require('path');
console.log('🔄 RESETTING AUTHENTICATION SYSTEM...\n');
const envPath = path.join(__dirname, '.env.local');
let envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('JWT_SECRET')) {
  envContent += '\nJWT_SECRET=rahasia_sekali_sekolah_sukasari_04_' + Date.now();
} else {
  envContent = envContent.replace(
    /JWT_SECRET=.*/,
    'JWT_SECRET=rahasia_sekali_sekolah_sukasari_04_' + Date.now()
  );
}
fs.writeFileSync(envPath, envContent);
console.log('✅ Updated JWT_SECRET in .env.local');
const authPath = path.join(__dirname, 'lib/auth.ts');
let authContent = fs.readFileSync(authPath, 'utf8');
const newSecret = envContent.match(/JWT_SECRET=(.*)/)[1];
authContent = authContent.replace(
  /const JWT_SECRET = .*;/,
  `const JWT_SECRET = process.env.JWT_SECRET || '${newSecret}';`
);
fs.writeFileSync(authPath, authContent);
console.log('✅ Updated JWT_SECRET in lib/auth.ts');
console.log('\n🆕 New JWT Secret:', newSecret.substring(0, 20) + '...');
console.log('\n🚨 RESTART SERVER: npm run dev');