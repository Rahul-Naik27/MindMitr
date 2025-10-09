// models/completionModel.js
const pool = require('../config/db');

async function markCompletion(userId, habitId, date, status = 'done') {
    const conn = await pool.getConnection();
    try {
        const [res] = await conn.execute(
            `INSERT INTO habit_completions (habit_id, user_id, date, status) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE status = ?`,
            [habitId, userId, date, status, status]
        );
        return res;
    } finally {
        conn.release();
    }
}

async function getUserHabitCompletions(userId, habitId) {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.execute(
            `SELECT date, status, created_at 
       FROM habit_completions 
       WHERE user_id = ? AND habit_id = ? 
       ORDER BY date DESC`,
            [userId, habitId]
        );
        return rows;
    } finally {
        conn.release();
    }
}

module.exports = { markCompletion, getUserHabitCompletions };