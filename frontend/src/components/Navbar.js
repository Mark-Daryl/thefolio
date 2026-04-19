// src/components/Navbar.js
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
    }
  }, []);

  return (
    <header>
      <nav>
        <div className="logo-container">
          <img 
            src="https://image.pngaaa.com/631/7777631-middle.png"
            alt="Dota 2 Logo" 
            className="header-logo"
            onError={(e) => {
              e.target.src = "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/dota_icon.png";
            }}
          />
          <h2>The Ancient's Blog</h2>
        </div>
        
        <ul>
          <li><Link to="/">🏠 Home</Link></li>
          <li><Link to="/about">📖 About</Link></li>
          <li><Link to="/contact">📞 Contact</Link></li>
          
          {user && (
            <>
              <li><Link to="/create-post">✍️ Write Post</Link></li>
              <li><Link to="/profile">👤 Profile</Link></li>
              
              {user.role === 'admin' && (
                <li><Link to="/admin">👑 Admin</Link></li>
              )}
              
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  🚪 Logout ({user.name})
                </button>
              </li>
            </>
          )}
          
          {!user && (
            <>
              <li><Link to="/login">🔑 Login</Link></li>
              <li><Link to="/register">📝 Register</Link></li>
            </>
          )}
          
          <li>
            <button onClick={toggleTheme} className="theme-toggle">
              🌓 
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;