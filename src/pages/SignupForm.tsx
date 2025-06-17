import React, { useState } from 'react';
import  supabase  from '../supabaseClient';
import './LoginForm.css'
import { useNavigate } from 'react-router-dom';

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleNavigate = () =>{
    navigate('/');
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(`Signup failed: ${error.message}`);
    } else {
      alert('Signup successful! Please verify your email.');
      console.log(data);
    }
  };

  return (
    <div className='box'>
      <form onSubmit={handleSignup}>
        <h2 style={{textAlign:'center',fontSize:'18px',marginBottom:'10px',fontWeight:'bold'}}>Sign Up</h2>
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
        <button type="submit">Register</button>
      </form>
        <p style={{color:"white",cursor:'pointer'}} onClick={handleNavigate} className='Home-btn'>Home</p>
    </div>
  );
};

export default SignupForm;
