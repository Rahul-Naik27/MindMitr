const pool = require('../config/db');

async function createHabit(userId, title, description, frequency, goal_duration, start_date) {
  const conn = await pool.getConnection();
  try {
    const duration = parseInt(goal_duration, 10);
    if (isNaN(duration) || duration <= 0) {
      throw new Error('Invalid goal_duration');
    }

    const startDateStr = typeof start_date === 'string'
      ? start_date
      : start_date.toISOString().slice(0, 10);

    const startDateObj = new Date(startDateStr + 'T00:00:00');
    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(startDateObj.getDate() + duration - 1);
    const end_date = endDateObj.toISOString().slice(0, 10);

    console.log('Creating habit with:', {
      duration,
      startDateStr,
      end_date,
      daysCalculated: duration
    });

    const [res] = await conn.execute(
      'INSERT INTO habits (user_id, title, description, frequency, goal_duration, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, title, description, frequency, duration, startDateStr, end_date]
    );

    return res.insertId;
  } catch (err) {
    console.error('Error creating habit:', err);
    throw err;
  } finally {
    conn.release();
  }
}

async function updateHabit(habitId, userId, title, description, frequency, goal_duration) {
  const conn = await pool.getConnection();
  try {
    const duration = parseInt(goal_duration, 10);
    if (isNaN(duration) || duration <= 0) {
      throw new Error('Invalid goal_duration');
    }

    const [habits] = await conn.execute(
      'SELECT start_date FROM habits WHERE id = ? AND user_id = ?',
      [habitId, userId]
    );

    if (habits.length === 0) return 0;

    const startDateStr = habits[0].start_date;
    const startDateObj = new Date(startDateStr + 'T00:00:00');
    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(startDateObj.getDate() + duration - 1);
    const end_date = endDateObj.toISOString().slice(0, 10);

    console.log('Updating habit with:', {
      duration,
      startDateStr,
      end_date,
      daysCalculated: duration
    });

    const [res] = await conn.execute(
      'UPDATE habits SET title = ?, description = ?, frequency = ?, goal_duration = ?, end_date = ? WHERE id = ? AND user_id = ?',
      [title, description, frequency, duration, end_date, habitId, userId]
    );

    return res.affectedRows;
  } catch (err) {
    console.error('Error updating habit:', err);
    throw err;
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
  } catch (err) {
    console.error('Error deleting habit:', err);
    throw err;
  } finally {
    conn.release();
  }
}

async function getHabitsForUser(userId) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      `SELECT id, title, description, frequency, goal_duration, start_date, end_date, created_at
       FROM habits
       WHERE user_id = ?`,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error('Error fetching habits for user:', error);
    throw error;
  } finally {
    conn.release();
  }
}

module.exports = {
  createHabit,
  updateHabit,
  deleteHabit,
  getHabitsForUser
};