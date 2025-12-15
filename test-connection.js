const mysql = require('mysql2/promise');
async function testConnection() {
  const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sdn_sukasari_04',
    port: 3306
  };
  try {
    console.log('Testing database connection...');
    console.log('Config:', { ...config, password: '***' });
    const connection = await mysql.createConnection(config);
    console.log('✅ Database connected successfully!');
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('✅ Query test:', rows);
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('✅ Tables:', tables.map(t => Object.values(t)[0]));
    await connection.end();
    console.log('✅ Connection closed.');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\nPossible solutions:');
    console.log('1. Check MySQL is running: `mysql.server start` or start XAMPP/WAMP');
    console.log('2. Check database exists: `CREATE DATABASE sdn_sukasari_04`');
    console.log('3. Check username/password in .env.local');
  }
}
testConnection();