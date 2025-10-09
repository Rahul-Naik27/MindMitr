const express = require('express');
const router = express.Router();
const { markCompletion, getUserHabitCompletions } = require('../models/completionModel');
const { createHabit, updateHabit, deleteHabit, getHabitsForUser } = require('../models/habitModel');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// ===== HELPER FUNCTIONS =====

// Helper to normalize date to YYYY-MM-DD string
function normalizeDateString(date) {
    if (typeof date === 'string') return date;
    return new Date(date).toISOString().slice(0, 10);
}

// Function to calculate streak based on frequency
function calculateStreak(habit, completions) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Normalize all dates to YYYY-MM-DD strings
    const doneDates = new Set(
        completions
            .filter(c => c.status === 'done')
            .map(c => normalizeDateString(c.date))
    );

    console.log(`\n=== Calculating Streak for ${habit.frequency} habit ===`);
    console.log('Done dates:', Array.from(doneDates));

    let streak = 0;
    let currentDate = new Date(today);

    if (habit.frequency === 'daily') {
        // Check consecutive days backwards from today
        while (true) {
            const dateStr = currentDate.toISOString().slice(0, 10);
            if (doneDates.has(dateStr)) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
    } else if (habit.frequency === 'weekly') {
        // Check consecutive weeks backwards from current week
        // Week starts on Sunday
        let weekStart = new Date(currentDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);

        while (true) {
            const weekStartStr = weekStart.toISOString().slice(0, 10);
            console.log(`Checking week: ${weekStartStr}, Has it? ${doneDates.has(weekStartStr)}`);
            if (doneDates.has(weekStartStr)) {
                streak++;
                weekStart.setDate(weekStart.getDate() - 7);
            } else {
                break;
            }
        }
    } else if (habit.frequency === 'monthly') {
        // Check consecutive months backwards from current month
        let monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        monthStart.setHours(0, 0, 0, 0);

        while (true) {
            const monthStr = monthStart.toISOString().slice(0, 10);
            console.log(`Checking month: ${monthStr}, Has it? ${doneDates.has(monthStr)}`);
            if (doneDates.has(monthStr)) {
                streak++;
                monthStart.setMonth(monthStart.getMonth() - 1);
            } else {
                break;
            }
        }
    }

    console.log(`Final streak: ${streak}\n`);
    return streak;
}

// Function to calculate completion percentage based on frequency
function calculateCompletionPercentage(habit, completions) {
    const createdAt = new Date(habit.created_at);
    createdAt.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let expectedPeriods = 0;

    if (habit.frequency === 'daily') {
        // Count days from creation to today (inclusive)
        const daysDiff = Math.floor((today - createdAt) / (1000 * 60 * 60 * 24));
        expectedPeriods = daysDiff + 1;
    } else if (habit.frequency === 'weekly') {
        // Count weeks from creation to today
        const weeksDiff = Math.floor((today - createdAt) / (1000 * 60 * 60 * 24 * 7));
        expectedPeriods = weeksDiff + 1;
    } else if (habit.frequency === 'monthly') {
        // Count months from creation to today
        const monthsDiff = (today.getFullYear() - createdAt.getFullYear()) * 12
            + (today.getMonth() - createdAt.getMonth());
        expectedPeriods = monthsDiff + 1;
    }

    const completedCount = completions.filter(c => c.status === 'done').length;
    return Math.min(100, Math.round((completedCount / expectedPeriods) * 100));
}

// ===== ROUTES =====

// --- Add habit ---
router.post('/add', async (req, res) => {
    const { title, description, frequency } = req.body;
    const userId = req.user.id;
    if (!title) return res.status(400).json({ message: 'Title required' });

    try {
        const id = await createHabit(userId, title, description || null, frequency || 'daily');
        res.status(201).json({ message: 'Habit added', id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Update habit ---
router.put('/update/:id', async (req, res) => {
    const { title, description, frequency } = req.body;
    const habitId = req.params.id;
    const userId = req.user.id;
    if (!title) return res.status(400).json({ message: 'Title required' });

    try {
        const affected = await updateHabit(habitId, userId, title, description || null, frequency || 'daily');
        if (!affected) return res.status(404).json({ message: 'Habit not found or not yours' });
        res.json({ message: 'Updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Delete habit ---
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

// --- Get all habits for a user ---
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

                // Normalize completion dates to YYYY-MM-DD format for comparison
                const normalizedCompletions = completions.map(c => ({
                    ...c,
                    date: normalizeDateString(c.date)
                }));

                // Check if completed today based on frequency
                let completedToday = false;
                if (habit.frequency === 'daily') {
                    completedToday = normalizedCompletions.some(
                        c => c.date === todayStr && c.status === 'done'
                    );
                } else if (habit.frequency === 'weekly') {
                    // Check if completed this week (Sunday of this week)
                    const sunday = new Date(today);
                    sunday.setDate(today.getDate() - today.getDay());
                    const sundayStr = sunday.toISOString().slice(0, 10);
                    completedToday = normalizedCompletions.some(
                        c => c.date === sundayStr && c.status === 'done'
                    );
                } else if (habit.frequency === 'monthly') {
                    // Check if completed this month (1st of this month)
                    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                    const firstDayStr = firstDay.toISOString().slice(0, 10);
                    completedToday = normalizedCompletions.some(
                        c => c.date === firstDayStr && c.status === 'done'
                    );
                }

                // Calculate streak (frequency-aware)
                const streak = calculateStreak(habit, normalizedCompletions);

                // Calculate completion percentage (frequency-aware)
                const completionPct = calculateCompletionPercentage(habit, normalizedCompletions);

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

// --- Mark habit as complete ---
router.post('/mark', async (req, res) => {
    const { habitId } = req.body;
    const userId = req.user.id;

    try {
        // First, get the habit to check its frequency
        const habits = await getHabitsForUser(userId);
        const habit = habits.find(h => h.id === habitId);

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Get current date in local timezone
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // getMonth() returns 0-11
        const day = now.getDate();
        const todayStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        let dateToStore;

        // Normalize date based on frequency
        if (habit.frequency === 'weekly') {
            // Store the Sunday of this week
            const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
            const sundayDate = new Date(year, month - 1, day - dayOfWeek);
            const sundayYear = sundayDate.getFullYear();
            const sundayMonth = sundayDate.getMonth() + 1;
            const sundayDay = sundayDate.getDate();
            dateToStore = `${sundayYear}-${String(sundayMonth).padStart(2, '0')}-${String(sundayDay).padStart(2, '0')}`;
        } else if (habit.frequency === 'monthly') {
            // Store the 1st of this month
            dateToStore = `${year}-${String(month).padStart(2, '0')}-01`;
        } else {
            // Daily: store today's date
            dateToStore = todayStr;
        }

        await markCompletion(userId, habitId, dateToStore, 'done');

        // Small delay to ensure database has committed the transaction
        await new Promise(resolve => setTimeout(resolve, 50));

        const completions = await getUserHabitCompletions(userId, habitId);

        // Normalize completions
        const normalizedCompletions = completions.map(c => ({
            ...c,
            date: normalizeDateString(c.date)
        }));

        // Debug: Log what we stored and what we got back
        console.log('Date stored:', dateToStore);
        console.log('Completions retrieved:', normalizedCompletions.map(c => c.date));

        // Use the same calculation functions
        const streak = calculateStreak(habit, normalizedCompletions);
        const completionPct = calculateCompletionPercentage(habit, normalizedCompletions);

        res.json({
            success: true,
            habit: {
                id: habit.id,
                title: habit.title,
                description: habit.description,
                frequency: habit.frequency,
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