import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

interface NavigationProps {
  onThemeToggle: () => void;
  currentTheme: 'light' | 'dark';
}

const Navigation: React.FC<NavigationProps> = ({ onThemeToggle, currentTheme }) => {
  return (
    <nav className="main-nav">
      <div className="nav-links">
        <NavLink to="/">Learn</NavLink>
        <NavLink to="/review">Review</NavLink>
        <NavLink to="/test">Test</NavLink>
        <NavLink to="/stats">Stats</NavLink>
      </div>
      <button onClick={onThemeToggle} className="theme-toggle-button">
        {currentTheme === 'light' ? '🌙' : '☀️'}
      </button>
    </nav>
  );
};

export default Navigation; 