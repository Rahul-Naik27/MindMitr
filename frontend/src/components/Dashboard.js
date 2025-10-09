import React, { useEffect, useState } from 'react';
import { API } from '../api';
import { ProgressBar, Badge } from 'react-bootstrap';
import AddHabit from './AddHabit';

const Dashboard = ({ userId }) => {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState({}); // { habitId: { status, streak } }
  const [refresh, setRefresh] = useState(false);

  // Fetch all habits
  const fetchHabits = async () => {
    try {
      const res = await API.get(`/habits/${userId}`);
      setHabits(res.data);

      const logObj = {};

      // For each habit, check today's status and calculate streak
      for (let habit of res.data) {
        const today = new Date().toISOString().split('T')[0];

        // Mark today as pending if no log exists
        const logRes = await API.post('/logs/mark', { habit_id: habit.id, log_date: today, status: 'pending' });
        let status = logRes.data.log.status;

        // Calculate streak (count consecutive 'completed' days from logs)
        // Simplified: streak = 1 if today completed, else 0 (can be enhanced)
        let streak = status === 'completed' ? 1 : 0;

        logObj[habit.id] = { status, streak };
      }

      setLogs(logObj);

    } catch (err) {
      console.error(err);
    }
  };

  // Mark habit as completed
  const markCompleted = async (habitId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await API.post('/logs/mark', { habit_id: habitId, log_date: today, status: 'completed' });
      setLogs(prev => ({ ...prev, [habitId]: { status: 'completed', streak: prev[habitId].streak + 1 } }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchHabits(); }, [refresh]);

  // Calculate today's completion %
  const completedCount = Object.values(logs).filter(l => l.status === 'completed').length;
  const totalCount = habits.length;
  const completionPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="container mt-4">
      <h2>Dashboard</h2>

      {/* Daily Summary */}
      <div className="mb-3">
        <h5>Today's Progress: {completedCount}/{totalCount} habits completed</h5>
        <ProgressBar now={completionPercent} label={`${completionPercent}%`} />
      </div>

      {/* Add Habit */}
      <AddHabit userId={userId} onHabitAdded={() => setRefresh(!refresh)} />

      {/* Habit List */}
      <h4 className="mt-4">Your Habits</h4>
      <ul className="list-group">
        {habits.map(habit => {
          const log = logs[habit.id] || { status: 'pending', streak: 0 };
          const progress = log.status === 'completed' ? 100 : 0;

          return (
            <li key={habit.id} className="list-group-item mb-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{habit.title}</strong> 
                  <Badge bg={log.status === 'completed' ? 'success' : 'secondary'} className="ms-2">{log.status}</Badge>
                  <ProgressBar now={progress} className="mt-2" />
                  <small className="text-muted">Streak: {log.streak} days</small>
                </div>
                {log.status === 'pending' && 
                  <button className="btn btn-sm btn-primary" onClick={() => markCompleted(habit.id)}>Mark Completed</button>
                }
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Dashboard;