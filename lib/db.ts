import mysql from 'mysql2/promise';
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sdn_sukasari_04_final',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};
const pool = mysql.createPool(dbConfig);
export async function queryDB<T>(sql: string, values?: any[]): Promise<T> {
  try {
    const [rows] = await pool.execute(sql, values);
    return rows as T;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}
export async function querySingle<T>(sql: string, values?: any[]): Promise<T | null> {
  try {
    const rows = await queryDB<any[]>(sql, values);
    return rows.length > 0 ? (rows[0] as T) : null;
  } catch (error) {
    console.error('Database error (single query):', error);
    throw error;
  }
}