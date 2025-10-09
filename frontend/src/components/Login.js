import React, { useState } from 'react';
import { API } from '../api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/users/login', { email, password });
      const { token, userId } = res.data;
      localStorage.setItem('token', token);  // store JWT
      onLogin(userId);
    } catch(err) {
      setMessage(err.response?.data?.message || 'Error logging in');
    }
  }

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input className="form-control mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
      {message && <p className="mt-2 text-danger">{message}</p>}
    </div>
  );
}

export default Login;