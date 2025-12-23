import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/auth/register', {
        username,
        email,
        password
      });

      alert('Registration successful. Please login.');
      navigate('/login', { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Register</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">Register</button>
      <p>Already have an account? <a href='/login'>Login</a></p>
    </form>
  );
}
