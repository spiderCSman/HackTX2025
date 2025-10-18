import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/global.css';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav
      // 🛑 FIXED: Replaced inline style with CSS class 'navbar'
      className="navbar" 
    >
      <h2>HackTX 2025</h2>
      <div>
        <button
          onClick={() => navigate('/')}
          // 🛑 FIXED: Removed inline style entirely, now relies on CSS selector '.navbar button'
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default NavBar;