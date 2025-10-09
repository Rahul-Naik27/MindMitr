import React, { useState } from 'react';
import { API } from '../api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/users/register', { name, email, password });
      setMessage(res.data.message);
      setName(''); setEmail(''); setPassword('');
    } catch(err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  }

  return (
    <div className="container mt-4">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input className="form-control mb-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="form-control mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="form-control mb-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-primary" type="submit">Register</button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}

export default Register;