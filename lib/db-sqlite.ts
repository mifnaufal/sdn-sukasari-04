// lib/db-sqlite.ts
import Database from 'better-sqlite3';

const db = new Database(':memory:');

// Buat tabel
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  INSERT OR IGNORE INTO users (name, email, password, role) 
  VALUES ('Admin SDN Sukasari 04', 'admin@sukasari04.sch.id', '123', 'admin');
`);

export const dbSqlite = db;