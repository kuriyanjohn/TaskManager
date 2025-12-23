import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {  
  console.log('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

const submit = async (e) => {
  e.preventDefault();
  const res = await api.post('/auth/login', { email, password });
  login(res.data.token);
  console.log('login data',res.data);
  
  navigate('/', { replace: true });
};

  return (
    <form onSubmit={submit}>
      <input onChange={e=>setEmail(e.target.value)} placeholder="Email"/>
      <input type="password" onChange={e=>setPassword(e.target.value)} />
      <button>Login</button>
      <p>Don't have an account? <a href='/register'>Register</a></p>
    </form>
  );
}
