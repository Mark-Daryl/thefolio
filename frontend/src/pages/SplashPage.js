// src/pages/SplashPage.js
import { Link } from 'react-router-dom';

const SplashPage = () => {
  return (
    <div className="splash-container">
      <div className="container">
        <img 
          src="/logo512.png" 
          alt="TheFolio Logo" 
          className="splash-logo"
        />
        <h1>Welcome to TheFolio</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Share your stories, connect with readers, and express yourself
        </p>
        <Link to="/home">
          <button className="splash-button">Enter TheFolio →</button>
        </Link>
      </div>
    </div>
  );
};

export default SplashPage;