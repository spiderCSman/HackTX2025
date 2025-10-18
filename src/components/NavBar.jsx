import React from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/global.css'; // Ensure this path is correct

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <h2>HackTX 2025</h2>
      <div>
        <button onClick={() => navigate('/')}>Sign Out</button>
      </div>
    </nav>
  );
};

export default NavBar;