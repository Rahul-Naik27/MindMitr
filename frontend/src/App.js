import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [userId, setUserId] = useState(null);

  const handleLogin = (id) => {
    setUserId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserId(null);
  };

  if (!userId) {
    return (
      <div className="container mt-4">
        <h1>DailyDost</h1>
        <Login onLogin={handleLogin} />
        <hr />
        <Register />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>DailyDost Dashboard</h1>
      <button className="btn btn-danger mb-3" onClick={handleLogout}>Logout</button>
      <Dashboard userId={userId} />
    </div>
  );
}

export default App;