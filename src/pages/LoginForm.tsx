import React, { useState } from 'react';
import supabase from '../supabaseClient';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/SignupForm');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(`Login failed: ${error.message}`);
    } else {
      alert('Login successful!');
      console.log('User:', data.user);

      // ✅ Navigate only if login is successful
      navigate('/patientDashboard');
    }
  };

  return (
    <div className='box'>
      <form onSubmit={handleLogin}>
        <h2 style={{ textAlign: 'center', fontSize: '18px', marginBottom: '10px', fontWeight: 'bold' }}>Login</h2>
        <input
          className='input'
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className='input'
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* ✅ Removed onClick — use onSubmit */}
        <button type="submit">Log In</button>
      </form>
      <p onClick={handleNavigate} id='any'>Create account?</p>
    </div>
  );
};

export default LoginForm;
