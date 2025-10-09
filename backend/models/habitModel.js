// models/habitModel.js
const pool = require('../config/db');

async function createHabit(userId, title, description = null, frequency = 'daily') {
  const conn = await pool.getConnection();
  try {
    const [res] = await conn.execute(
      'INSERT INTO habits (user_id, title, description, frequency) VALUES (?, ?, ?, ?)',
      [userId, title, description, frequency]
    );
    return res.insertId;
  } finally {
    conn.release();
  }
}

async function updateHabit(habitId, userId, title, description, frequency = 'daily') {
  const conn = await pool.getConnection();
  try {
    const [res] = await conn.execute(
      'UPDATE habits SET title = ?, description = ?, frequency = ? WHERE id = ? AND user_id = ?',
      [title, description, frequency, habitId, userId]
    );
    return res.affectedRows;
  } finally {
    conn.release();
  }
}

async function deleteHabit(habitId, userId) {
  const conn = await pool.getConnection();
  try {
    const [res] = await conn.execute(
      'DELETE FROM habits WHERE id = ? AND user_id = ?',
      [habitId, userId]
    );
    return res.affectedRows;
  } finally {
    conn.release();
  }
}

async function getHabitsForUser(userId) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id, title, description, frequency, created_at FROM habits WHERE user_id = ?',
      [userId]
    );
    return rows;
  } finally {
    conn.release();
  }
}

module.exports = { createHabit, updateHabit, deleteHabit, getHabitsForUser };