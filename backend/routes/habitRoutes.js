const express = require('express');
const router = express.Router();
const { markCompletion, getUserHabitCompletions } = require('../models/completionModel');
const { createHabit, updateHabit, deleteHabit, getHabitsForUser } = require('../models/habitModel');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

function normalizeDateString(date) {
  if (!date) return '';
  if (typeof date === 'string') {
    return date.slice(0, 10);
  }
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return String(date).slice(0, 10);
}

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function calculateStreak(habit, completions) {
  const doneDates = new Set(
    completions.filter(c => c.status === 'done').map(c => normalizeDateString(c.date))
  );

  let streak = 0;
  const now = new Date();
  let currentDate = new Date(now);

  if (habit.frequency === 'daily') {
    while (true) {
      const y = currentDate.getFullYear();
      const m = String(currentDate.getMonth() + 1).padStart(2, '0');
      const d = String(currentDate.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      if (doneDates.has(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else break;
    }
  } else if (habit.frequency === 'weekly') {
    let weekStart = new Date(currentDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    while (true) {
      const y = weekStart.getFullYear();
      const m = String(weekStart.getMonth() + 1).padStart(2, '0');
      const d = String(weekStart.getDate()).padStart(2, '0');
      const weekStartStr = `${y}-${m}-${d}`;
      if (doneDates.has(weekStartStr)) {
        streak++;
        weekStart.setDate(weekStart.getDate() - 7);
      } else break;
    }
  } else if (habit.frequency === 'monthly') {
    let monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    while (true) {
      const y = monthStart.getFullYear();
      const m = String(monthStart.getMonth() + 1).padStart(2, '0');
      const monthStr = `${y}-${m}-01`;
      if (doneDates.has(monthStr)) {
        streak++;
        monthStart.setMonth(monthStart.getMonth() - 1);
      } else break;
    }
  }

  return streak;
}

function calculateCompletionPercentage(habit, completions) {
  const completedCount = completions.filter(c => c.status === 'done').length;
  const goal = parseInt(habit.goal_duration, 10) || 1;
  const pct = (completedCount / goal) * 100;
  return Math.min(100, Math.round(pct));
}

// POST /api/habits/add
router.post('/add', async (req, res) => {
  const { title, description, frequency, goal_duration, start_date } = req.body;
  const userId = req.user.id;
  if (!title) return res.status(400).json({ message: 'Title required' });

  try {
    const todayStr = getTodayString();
    const id = await createHabit(
      userId,
      title,
      description || null,
      frequency || 'daily',
      goal_duration || 30,
      start_date || todayStr
    );
    res.status(201).json({ message: 'Habit added', id });
  } catch (err) {
    console.error('Error creating habit:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// PUT /api/habits/update/:id
router.put('/update/:id', async (req, res) => {
  const { title, description, frequency, goal_duration } = req.body;
  const habitId = req.params.id;
  const userId = req.user.id;
  if (!title) return res.status(400).json({ message: 'Title required' });

  try {
    const affected = await updateHabit(
      habitId,
      userId,
      title,
      description || null,
      frequency || 'daily',
      goal_duration || 30
    );
    if (!affected) return res.status(404).json({ message: 'Habit not found or not yours' });
    res.json({ message: 'Updated' });
  } catch (err) {
    console.error('Error updating habit:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// DELETE /api/habits/delete/:id
router.delete('/delete/:id', async (req, res) => {
  const habitId = req.params.id;
  const userId = req.user.id;
  try {
    const affected = await deleteHabit(habitId, userId);
    if (!affected) return res.status(404).json({ message: 'Habit not found or not yours' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting habit:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// GET /api/habits
router.get('/', async (req, res) => {
  const userId = req.user.id;

  try {
    const habits = await getHabitsForUser(userId);
    const todayStr = getTodayString();

    const habitsWithStats = await Promise.all(
      habits.map(async habit => {
        const completions = await getUserHabitCompletions(userId, habit.id);
        const normalized = completions.map(c => ({ ...c, date: normalizeDateString(c.date) }));

        const streak = calculateStreak(habit, normalized);
        const completionPct = calculateCompletionPercentage(habit, normalized);

        const completedToday = normalized.some(
          c => c.date === todayStr && c.status === 'done'
        );

        return {
          ...habit,
          streak,
          completion_pct: completionPct,
          completedToday
        };
      })
    );

    res.json({ habits: habitsWithStats });
  } catch (err) {
    console.error('Error fetching habits:', err);
    res.status(500).json({ message: 'Failed to fetch habits' });
  }
});

// POST /api/habits/mark
router.post('/mark', async (req, res) => {
  const { habitId } = req.body;
  const userId = req.user.id;

  try {
    const habits = await getHabitsForUser(userId);
    const habit = habits.find(h => String(h.id) === String(habitId));
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const now = new Date();
    const todayStr = getTodayString();

    const startStr = normalizeDateString(habit.start_date);
    const endStr = normalizeDateString(habit.end_date);

    if (todayStr < startStr || todayStr > endStr) {
      return res.status(400).json({ message: `Outside goal period (${startStr} to ${endStr})` });
    }

    let dateToStore = todayStr;
    if (habit.frequency === 'weekly') {
      const sunday = new Date(now);
      sunday.setDate(now.getDate() - now.getDay());
      const sYear = sunday.getFullYear();
      const sMonth = String(sunday.getMonth() + 1).padStart(2, '0');
      const sDay = String(sunday.getDate()).padStart(2, '0');
      dateToStore = `${sYear}-${sMonth}-${sDay}`;
    } else if (habit.frequency === 'monthly') {
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      dateToStore = `${year}-${month}-01`;
    }

    await markCompletion(userId, habit.id, dateToStore, 'done');

    const completions = await getUserHabitCompletions(userId, habit.id);
    const normalized = completions.map(c => ({ ...c, date: normalizeDateString(c.date) }));

    const streak = calculateStreak(habit, normalized);
    const completionPct = calculateCompletionPercentage(habit, normalized);

    res.json({
      success: true,
      habit: {
        ...habit,
        streak,
        completion_pct: completionPct,
        completedToday: true
      }
    });
  } catch (err) {
    console.error('Error marking habit:', err);
    res.status(500).json({ message: err.message || 'Failed to mark habit' });
  }
});

module.exports = router;