import React, { useEffect, useState } from 'react';
import { API } from '../api';

const HabitList = ({ userId }) => {
  const [habits, setHabits] = useState([]);

  const fetchHabits = async () => {
    try {
      const res = await API.get(`/habits/${userId}`);
      setHabits(res.data);
    } catch(err) {
      console.error(err);
    }
  };

  const markCompleted = async (habitId) => {
    try {
      await API.post('/logs/mark', { habit_id: habitId, log_date: new Date().toISOString().split('T')[0], status: 'completed' });
      fetchHabits(); // refresh list
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchHabits(); }, []);

  return (
    <div>
      <h4>Your Habits</h4>
      <ul className="list-group">
        {habits.map(habit => (
          <li key={habit.id} className="list-group-item d-flex justify-content-between align-items-center">
            {habit.title} ({habit.frequency})
            <button className="btn btn-sm btn-primary" onClick={() => markCompleted(habit.id)}>Mark Completed</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HabitList;