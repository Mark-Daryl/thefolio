// src/pages/LoginPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2 className="text-center">Welcome Back</h2>
        <p className="text-center" style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Login to your TheFolio account
        </p>
        
        {error && <div className="error-msg">{error}</div>}
        
        <label>📧 Email Address</label>
        <input 
          type="email" 
          placeholder="you@example.com"
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          disabled={loading}
        />
        
        <label>🔒 Password</label>
        <div className="password-wrapper">
          <input 
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            disabled={loading}
          />
          <span 
            className="toggle-eye" 
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: 'pointer' }}
          >
            {showPassword ? "👁️" : "🔒"}
          </span>
        </div>
        
        {/* Forgot Password Link */}
        <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
          <Link 
            to="/forgot-password" 
            style={{ 
              color: 'var(--accent)', 
              fontSize: '0.85rem',
              textDecoration: 'none'
            }}
          >
            Forgot Password?
          </Link>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <p className="text-center" style={{ marginTop: '1rem' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;