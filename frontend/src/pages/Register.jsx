import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

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
        password,
      });

      alert('Registration successful. Please login.');
      navigate('/login', { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="app-container">
      <div className="dashboard" style={{ maxWidth: '420px' }}>

        <h2 className="text-center">Register</h2>

        <form className="form" onSubmit={submit}>

          <div className="form-group">
            <label>Username</label>
            <input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Register
          </button>

        </form>

        <p className="text-center mt-2">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}
