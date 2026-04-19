// src/components/Footer.js
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          {/* Logo & About Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <img 
                src="https://image.pngaaa.com/631/7777631-middle.png"
                alt="Dota 2 Logo" 
                className="footer-logo-img"
                onError={(e) => {
                  e.target.src = "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/dota_icon.png";
                }}
              />
              <h3>The Ancient's Blog</h3>
            </div>
            <p className="footer-description">
              A passionate Dota 2 community blog sharing strategies, 
              hero guides, patch analysis, and epic gaming moments.
            </p>
            <div className="social-links">
              <a href="https://discord.com/invite/dota2" target="_blank" rel="noopener noreferrer" className="social-icon">
                🎮 Discord
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                🐙 GitHub
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                🐦 Twitter
              </a>
              <a href="https://reddit.com/r/DotA2" target="_blank" rel="noopener noreferrer" className="social-icon">
                💬 Reddit
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">🏠 Home</Link></li>
              <li><Link to="/about">📖 About</Link></li>
              <li><Link to="/contact">📞 Contact</Link></li>
              {user && <li><Link to="/create-post">✍️ Write Post</Link></li>}
              {user && <li><Link to="/profile">👤 Profile</Link></li>}
              {user?.role === 'admin' && <li><Link to="/admin">👑 Admin Dashboard</Link></li>}
            </ul>
          </div>

          {/* Resources Section */}
          <div className="footer-section">
            <h4>Dota 2 Resources</h4>
            <ul className="footer-links">
              <li><a href="https://www.dotabuff.com/" target="_blank" rel="noopener noreferrer">📊 Dotabuff</a></li>
              <li><a href="https://www.reddit.com/r/DotA2/" target="_blank" rel="noopener noreferrer">💬 Reddit Dota 2</a></li>
              <li><a href="https://dota2.com/" target="_blank" rel="noopener noreferrer">🎮 Official Dota 2</a></li>
              <li><a href="https://liquipedia.net/dota2/Main_Page" target="_blank" rel="noopener noreferrer">📚 Liquipedia</a></li>
              <li><a href="https://www.twitch.tv/directory/game/Dota%202" target="_blank" rel="noopener noreferrer">📺 Twitch Streams</a></li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="footer-section">
            <h4>Get in Touch</h4>
            <ul className="footer-contact">
              <li>📧 <a href="mailto:ancient@thefolio.com">ancient@thefolio.com</a></li>
              <li>🎮 Discord: Ancient.Warrior#1234</li>
              <li>📍 Pasay, Metro Manila, Philippines</li>
            </ul>
            <div className="footer-stats">
              <p>⚔️ Dota 2 Community Since 2024</p>
              <p>🏆 Sharing Knowledge, Building Legends</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} The Ancient's Blog. All rights reserved.</p>
            <p className="footer-credits">
              Made with <span style={{ color: 'var(--accent)' }}>⚔️</span> for Dota 2 fans worldwide
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;