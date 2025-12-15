const mysql = require('mysql2/promise');
async function testDB() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'sdn_sukasari_04'
  });
  const [rows] = await connection.execute('SELECT email, role FROM users');
  console.log('Users in database:', rows);
  await connection.end();
}
testDB();