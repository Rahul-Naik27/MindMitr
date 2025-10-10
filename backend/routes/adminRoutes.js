const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const pool = require('../config/db');
const router = express.Router();

router.use(authenticate);
router.use(requireRole('admin'));

router.get('/overview', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [[u]] = await conn.query('SELECT COUNT(*) AS total_users FROM users');

    const [[h]] = await conn.query('SELECT COUNT(*) AS total_habits FROM habits');

    const [avgRows] = await conn.query(`
      SELECT AVG(user_completion) AS avg_completion_pct
      FROM (
        SELECT user_id,
          (SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS user_completion
        FROM habit_completions
        GROUP BY user_id
      ) AS per_user;
    `);

    const total_users = u.total_users || 0;
    const total_habits = h.total_habits || 0;
    const avg_completion_pct = avgRows[0]?.avg_completion_pct || 0;

    res.json({
      total_users,
      total_habits,
      avg_completion_pct: Number(avg_completion_pct).toFixed(2)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});


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
    res.json({ habits: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    conn.release();
  }
});
module.exports = router;