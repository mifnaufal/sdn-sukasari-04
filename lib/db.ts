import mysql from 'mysql2/promise';
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sdn_sukasari_04',
  port: 3306
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
    const [rows] = await pool.execute(sql, values);
    const result = rows as any[];
    return result.length > 0 ? (result[0] as T) : null;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}
export async function connectDB() {
  return pool;
}