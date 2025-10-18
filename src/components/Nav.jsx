import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css'; // Optional: Add custom styles for the navbar

const Nav = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <h1>MyApp</h1>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
                <li>
                    <Link to="/services">Services</Link>
                </li>
                <li>
                    <Link to="/contact">Contact</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Nav;