import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbarContainer">
        <div className="navbarLeft">
          <button 
            className="mobileMenuButton"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            ☰
          </button>
          
          <Link to="/" className="navbarBrand">
            RenTech
          </Link>
        </div>

        <div className="navbarCenter">
          <SearchBar placeholder="Keresés laptop, kamera, projektor..." />
        </div>

        <div className="navbarRight">
          <div className={`navbarMenu ${showMobileMenu ? 'mobileVisible' : ''}`}>
            <Link to="/" className="navbarLink">Főoldal</Link>
            <Link to="/devices" className="navbarLink">Eszközök</Link>
            
            {isAuthenticated && (
              <Link to="/bookings" className="navbarLink">
                Foglalásaim
              </Link>
            )}
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="navbarLink">Profil</Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="navbarLink adminLink">Admin</Link>
                )}
                <span className="navbarWelcome">Üdv, {user?.name}</span>
                <button onClick={handleLogout} className="navbarButton">
                  Kijelentkezés
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbarButton">
                  Bejelentkezés
                </Link>
                <Link to="/register" className="navbarButton register">
                  Regisztráció
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}