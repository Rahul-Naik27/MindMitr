const pool = require('../config/db');

async function createUser(name, email, hashedPassword, role = 'user') {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
}

async function getUserByEmail(email) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute('SELECT id, name, email, password, role FROM users WHERE email = ?', [email]);
    return rows[0];
  } finally {
    conn.release();
  }
}

async function getUserById(id) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0];
  } finally {
    conn.release();
  }
}

async function countUsers() {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute('SELECT COUNT(*) as total FROM users');
    return rows[0].total;
  } finally {
    conn.release();
  }
}

module.exports = { createUser, getUserByEmail, getUserById, countUsers };