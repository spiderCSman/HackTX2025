// src/components/Home.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Tarot from './Tarot';

const Home = () => {
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || null);

  useEffect(() => {
    console.log('User loaded into Home:', user);
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px', color: '#fff' }}>
        <h2>Loading user data...</h2>
      </div>
    );
  }

  return (
    <div style={{ color: '#fff', minHeight: '100vh', background: '#0d1117' }}>
      <NavBar />
      <div style={{ padding: '20px' }}>
        <h1>Welcome to Astronomical</h1>
        <p>Hello, {user.name}!</p>
        <div> 
        <div
            style={{
              width: 'full',
              height: 'full',
              padding: '10px',
            }}
          >
            <Tarot />

          </div>
        </div>
        {/*{user.isAdmin && (
          <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <h2>Admin Dashboard</h2>
            <p>You have administrator privileges.</p>
          </div>

        )}
          */}
      </div>
    </div>
  );
};

export default Home;
