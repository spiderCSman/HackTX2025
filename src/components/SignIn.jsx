import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Login successful!');
        navigate('/home', { state: { user: data.userId } });
      } else {
        alert(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed. Check your network or server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)',
      color: '#fff',
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#161b22',
        padding: '2rem',
        borderRadius: '10px',
        width: '320px',
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.4)',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Sign In</h2>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '5px',
            border: '1px solid #30363d',
            backgroundColor: '#0d1117',
            color: '#fff',
          }}
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '5px',
            border: '1px solid #30363d',
            backgroundColor: '#0d1117',
            color: '#fff',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#23863680' : '#238636',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            color: '#fff',
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default SignIn;
