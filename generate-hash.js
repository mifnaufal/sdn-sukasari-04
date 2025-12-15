const bcrypt = require('bcryptjs');
async function generateHash() {
  const passwords = [
    { password: 'admin123', user: 'admin@sukasari04.sch.id' },
    { password: 'user123', user: 'user@example.com' },
    { password: 'guru123', user: 'guru@example.com' }
  ];
  for (const item of passwords) {
    const hash = await bcrypt.hash(item.password, 10);
    console.log(`\n-- ${item.user}:`);
    console.log(`Password: ${item.password}`);
    console.log(`Hash: ${hash}`);
    console.log(`SQL:`);
    console.log(`UPDATE users SET password = '${hash}' WHERE email = '${item.user}';`);
    console.log(`INSERT INTO users (name, email, password, role) VALUES ('User', '${item.user}', '${hash}', 'user');`);
  }
}
generateHash();