import mysql from 'mysql2/promise';
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sdn_sukasari_04',
  port: 3306
};
const pool = mysql.createPool(dbConfig);
export async function queryDB(sql: string, values?: any[]) {
  try {
    const [rows] = await pool.execute(sql, values);
    return rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}
export async function connectDB() {
  return pool;
}