const express = require('express');
const router = express.Router();
const { markCompletion, getUserHabitCompletions } = require('../models/completionModel');
const { createHabit, updateHabit, deleteHabit, getHabitsForUser } = require('../models/habitModel');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

function normalizeDateString(date) {
  if (typeof date === 'string') return date;
  return new Date(date).toISOString().slice(0, 10);
}

function calculateStreak(habit, completions) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const doneDates = new Set(
    completions.filter(c => c.status === 'done').map(c => normalizeDateString(c.date))
  );

  let streak = 0;
  let currentDate = new Date(today);

  if (habit.frequency === 'daily') {
    while (true) {
      const dateStr = currentDate.toISOString().slice(0, 10);
      if (doneDates.has(dateStr)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else break;
    }
  } else if (habit.frequency === 'weekly') {
    let weekStart = new Date(currentDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    while (true) {
      const weekStartStr = weekStart.toISOString().slice(0, 10);
      if (doneDates.has(weekStartStr)) {
        streak++;
        weekStart.setDate(weekStart.getDate() - 7);
      } else break;
    }
  } else if (habit.frequency === 'monthly') {
    let monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);

    while (true) {
      const monthStr = monthStart.toISOString().slice(0, 10);
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
  const pct = (completedCount / habit.goal_duration) * 100;
  return Math.min(100, Math.round(pct));
}


router.post('/add', async (req, res) => {
  const { title, description, frequency, goal_duration, start_date } = req.body;
  const userId = req.user.id;
  if (!title) return res.status(400).json({ message: 'Title required' });

  try {
    const id = await createHabit(
      userId,
      title,
      description || null,
      frequency || 'daily',
      goal_duration || 30,
      start_date || new Date().toISOString().slice(0, 10)
    );
    res.status(201).json({ message: 'Habit added', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

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
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const habitId = req.params.id;
  const userId = req.user.id;
  try {
    const affected = await deleteHabit(habitId, userId);
    if (!affected) return res.status(404).json({ message: 'Habit not found or not yours' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/', async (req, res) => {
  const userId = req.user.id;

  try {
    const habits = await getHabitsForUser(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().slice(0, 10);

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
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch habits' });
  }
});

router.post('/mark', async (req, res) => {
  const { habitId } = req.body;
  const userId = req.user.id;

  try {
    const habits = await getHabitsForUser(userId);
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const today = new Date();
    const start = new Date(habit.start_date);
    const end = new Date(habit.end_date);

    if (today < start || today > end)
      return res.status(400).json({ message: 'Outside goal period' });

    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    let dateToStore;

    if (habit.frequency === 'weekly') {
      const sunday = new Date(today);
      sunday.setDate(today.getDate() - today.getDay());
      dateToStore = normalizeDateString(sunday);
    } else if (habit.frequency === 'monthly') {
      dateToStore = `${year}-${String(month).padStart(2, '0')}-01`;
    } else {
      dateToStore = todayStr;
    }

    await markCompletion(userId, habitId, dateToStore, 'done');

    const completions = await getUserHabitCompletions(userId, habitId);
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
    console.error(err);
    res.status(500).json({ message: 'Failed to mark habit' });
  }
});

module.exports = router;