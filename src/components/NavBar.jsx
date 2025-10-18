import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/global.css';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav
      className="navbar" 
    >
      <h2>Astronomical</h2>
      <div>
        <button
          onClick={() => navigate('/')}
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default NavBar;