// routes/adminRoutes.js
const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const pool = require('../config/db');
const router = express.Router();

router.use(authenticate);
router.use(requireRole('admin'));

// Get overall overview: total users, active habits, global completion percentage
router.get('/overview', async (req, res) => {
    const conn = await pool.getConnection();
    try {
        // total users
        const [[u]] = await conn.query('SELECT COUNT(*) AS total_users FROM users');

        // total habits
        const [[h]] = await conn.query('SELECT COUNT(*) AS total_habits FROM habits');

        // global completion rate (aggregate across all users)
        // compute aggregated completion per user then average it (no PII)
        const [avgRows] = await conn.query(`
      SELECT AVG(user_completion) as avg_completion_pct FROM (
        SELECT user_id,
          (SUM(completed) / COUNT(*)) * 100 as user_completion
        FROM habit_completions
        GROUP BY user_id
      ) AS per_user;
    `);

        const avg_completion_pct = avgRows[0]?.avg_completion_pct || 0;

        res.json({
            total_users: u.total_users,
            total_habits: h.total_habits,
            average_completion_pct: Number(avg_completion_pct.toFixed(2))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        conn.release();
    }
});

// Top 5 most common habits (anonymized counts)
router.get('/popular-habits', async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query(`
      SELECT title, COUNT(*) AS count
      FROM habits
      GROUP BY title
      ORDER BY count DESC
      LIMIT 5
    `);
        res.json({ popular: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    } finally {
        conn.release();
    }
});

module.exports = router;