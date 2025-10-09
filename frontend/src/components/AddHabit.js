import React, { useState } from 'react';
import { API } from '../api';

const AddHabit = ({ userId, onHabitAdded }) => {
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('daily');

  const handleAddHabit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/habits/add', { user_id: userId, title, frequency });
      setTitle(''); setFrequency('daily');
      onHabitAdded(); // refresh habit list
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <div className="mb-3">
      <h4>Add Habit</h4>
      <form onSubmit={handleAddHabit}>
        <input className="form-control mb-2" placeholder="Habit Title" value={title} onChange={e => setTitle(e.target.value)} />
        <select className="form-control mb-2" value={frequency} onChange={e => setFrequency(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button className="btn btn-success" type="submit">Add</button>
      </form>
    </div>
  );
}

export default AddHabit;