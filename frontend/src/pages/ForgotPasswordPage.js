// src/pages/ForgotPasswordPage.js
import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setResetLink('');
    setLoading(true);

    try {
      const { data } = await API.post('/password/forgot-password', { email });
      setSuccess(data.message);
      
      // In development, show the reset link
      if (data.resetLink) {
        setResetLink(data.resetLink);
      }
      
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="hero-section" style={{ minHeight: '30vh', padding: '2rem' }}>
        <div className="container">
          <h1 className="hero-title">Forgot Password?</h1>
          <p className="hero-subtitle">
            Don't worry! Enter your email and we'll send you a reset link.
          </p>
        </div>
      </div>

      <div className="container">
        <section style={{ maxWidth: '500px', margin: '2rem auto' }}>
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}
          
          {resetLink && (
            <div style={{ 
              background: 'var(--bg-card)', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem',
              border: '1px solid var(--accent)'
            }}>
              <p><strong>Development Mode - Reset Link:</strong></p>
              <a href={resetLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', wordBreak: 'break-all' }}>
                {resetLink}
              </a>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <label>
              📧 Email Address
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
              />
            </label>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : '📩 Send Reset Link'}
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

export default ForgotPasswordPage;