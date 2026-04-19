// src/pages/ResetPasswordPage.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await API.get(`/password/reset-password/${token}`);
        setValidToken(true);
        setError('');
      } catch (err) {
        setValidToken(false);
        setError(err.response?.data?.message || 'Invalid or expired reset link');
      } finally {
        setCheckingToken(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await API.post(`/password/reset-password/${token}`, { password, confirmPassword });
      setSuccess('Password has been reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <div className="container">
        <div className="loading-spinner">Verifying reset link...</div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <>
        <div className="hero-section" style={{ minHeight: '30vh', padding: '2rem' }}>
          <div className="container">
            <h1 className="hero-title">Invalid Reset Link</h1>
            <p className="hero-subtitle">
              This password reset link is invalid or has expired.
            </p>
          </div>
        </div>
        <div className="container">
          <section style={{ textAlign: 'center', maxWidth: '500px', margin: '2rem auto' }}>
            <div className="error-msg">{error}</div>
            <Link to="/forgot-password">
              <button>Request New Reset Link</button>
            </Link>
            <div style={{ marginTop: '1rem' }}>
              <Link to="/login" style={{ color: 'var(--accent)' }}>← Back to Login</Link>
            </div>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hero-section" style={{ minHeight: '30vh', padding: '2rem' }}>
        <div className="container">
          <h1 className="hero-title">Reset Your Password</h1>
          <p className="hero-subtitle">
            Enter your new password below.
          </p>
        </div>
      </div>

      <div className="container">
        <section style={{ maxWidth: '500px', margin: '2rem auto' }}>
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <label>
              🔒 New Password
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  disabled={loading}
                />
                <span 
                  className="toggle-eye" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "🔒"}
                </span>
              </div>
            </label>
            
            <label>
              🔒 Confirm New Password
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  disabled={loading}
                />
              </div>
            </label>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : '✅ Reset Password'}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/login" style={{ color: 'var(--accent)' }}>
                ← Back to Login
              </Link>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default ResetPasswordPage;