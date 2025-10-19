import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAccount = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Account created successfully! You can now sign in.');
        navigate('/');
      } else {
        alert(`⚠️ ${data.message || 'Error creating account.'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to create account. Check your network or server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #0d1117 0%, #161b22 100%)',
        color: '#fff',
      }}
    >
      <form
        onSubmit={handleCreateAccount}
        style={{
          backgroundColor: '#161b22',
          padding: '2rem',
          borderRadius: '10px',
          width: '320px',
          boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.4)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Create Account</h2>

        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          {loading ? 'Creating...' : 'Create Account'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '10px',
            backgroundColor: '#6c757d',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            color: '#fff',
          }}
        >
          Back to Sign In
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
