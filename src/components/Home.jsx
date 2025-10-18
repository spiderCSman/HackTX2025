import React from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';

const Home = () => {
  const location = useLocation();
  const user = location.state?.user || { name: 'Guest', isAdmin: false };

  return (
    <div>
      {/* Navigation Bar */}
      <NavBar />

      {/* Main Content */}
      <div style={{ padding: '20px' }}>
        <h1>Welcome to Astronomical</h1>
        <p>Hello, {user.name}!</p>

        {user.isAdmin && (
          <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <h2>Admin Dashboard</h2>
            <ul>
              <li>Manage Users</li>
              <li>View Reports</li>
              <li>System Settings</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;