// src/pages/ContactPage.js
import { useState } from 'react';
import API from '../api/axios';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.id]) {
      setErrors({
        ...errors,
        [e.target.id]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message cannot be empty';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setSubmitError('');
      
      try {
        // Send message to backend
        const response = await API.post('/contact/send', formData);
        
        if (response.data.success) {
          setSubmitted(true);
          // Clear form
          setFormData({ name: '', email: '', message: '' });
        }
      } catch (err) {
        setSubmitError(err.response?.data?.message || 'Failed to send message. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  if (submitted) {
    return (
      <div className="container">
        <div className="hero-section" style={{ minHeight: '40vh', padding: '3rem 2rem' }}>
          <div className="container">
            <h1 className="hero-title">Thank You, {formData.name}!</h1>
            <p className="hero-subtitle">
              Your message has been successfully received. The admin will respond to you soon!
            </p>
          </div>
        </div>
        
        <section style={{ textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
          <div style={{ 
            padding: '3rem',
            background: 'var(--bg-card)',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-strong)',
            border: '1px solid var(--border-soft)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📬</div>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>
              Message Sent Successfully!
            </h3>
            <p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
              Your message has been sent to the Ancient's inbox.
            </p>
            <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
              The admin will respond within 24-48 hours.
            </p>
            <button onClick={() => {
              setSubmitted(false);
              setFormData({ name: '', email: '', message: '' });
            }}>
              Send Another Message
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section" style={{ minHeight: '40vh', padding: '3rem 2rem' }}>
        <div className="container">
          <h1 className="hero-title">Contact the Ancient</h1>
          <p className="hero-subtitle">
            Have questions about Dota 2? Want to collaborate? Reach out to me!
          </p>
        </div>
      </div>

      <div className="container">
        {/* Send Message Form - Full Width */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--accent)', marginBottom: '1rem', textAlign: 'center' }}>
            📝 Send Me a Message
          </h2>
          
          {submitError && (
            <div className="error-msg" style={{ maxWidth: '700px', margin: '0 auto 1rem auto' }}>
              {submitError}
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={{
            maxWidth: '700px',
            margin: '0 auto',
            background: 'var(--bg-card)',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-soft)',
            border: '1px solid var(--border-soft)'
          }}>
            <label>
              <span style={{ color: 'var(--accent)' }}>⚔️ Name</span>
              <input 
                type="text" 
                id="name" 
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'invalid' : ''}
                placeholder="Your display name"
                style={{ marginTop: '0.5rem' }}
                disabled={loading}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </label>

            <label>
              <span style={{ color: 'var(--accent)' }}>📧 Email</span>
              <input 
                type="email" 
                id="email" 
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'invalid' : ''}
                placeholder="your@email.com"
                style={{ marginTop: '0.5rem' }}
                disabled={loading}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </label>

            <label>
              <span style={{ color: 'var(--accent)' }}>💬 Message</span>
              <textarea 
                id="message" 
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? 'invalid' : ''}
                placeholder="Share your thoughts, questions, or collaboration ideas..."
                rows="5"
                style={{ 
                  marginTop: '0.5rem',
                  resize: 'vertical',
                  minHeight: '120px'
                }}
                disabled={loading}
              />
              {errors.message && <span className="error">{errors.message}</span>}
            </label>

            <button 
              type="submit"
              style={{
                width: '100%',
                marginTop: '2rem',
                padding: '1rem',
                fontSize: '1.1rem'
              }}
              disabled={loading}
            >
              {loading ? 'Sending...' : '🚀 Send Message'}
            </button>
          </form>
        </section>

        {/* Connect With Me - Below Send Message Form */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--accent)', marginBottom: '1rem', textAlign: 'center' }}>
            🔗 Connect With Me
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <div style={{
              background: 'var(--bg-card)',
              padding: '1.5rem',
              borderRadius: '16px',
              textAlign: 'center',
              border: '1px solid var(--border-soft)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎮</div>
              <h3 style={{ color: 'var(--accent)', fontSize: '1rem', marginBottom: '0.5rem' }}>Discord</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Ancient.Warrior#1234</p>
            </div>
            
            <div style={{
              background: 'var(--bg-card)',
              padding: '1.5rem',
              borderRadius: '16px',
              textAlign: 'center',
              border: '1px solid var(--border-soft)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🐙</div>
              <h3 style={{ color: 'var(--accent)', fontSize: '1rem', marginBottom: '0.5rem' }}>GitHub</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>github.com/ancient-dota</p>
            </div>
            
            <div style={{
              background: 'var(--bg-card)',
              padding: '1.5rem',
              borderRadius: '16px',
              textAlign: 'center',
              border: '1px solid var(--border-soft)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🐦</div>
              <h3 style={{ color: 'var(--accent)', fontSize: '1rem', marginBottom: '0.5rem' }}>Twitter/X</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>@AncientDota</p>
            </div>
            
            <div style={{
              background: 'var(--bg-card)',
              padding: '1.5rem',
              borderRadius: '16px',
              textAlign: 'center',
              border: '1px solid var(--border-soft)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏰</div>
              <h3 style={{ color: 'var(--accent)', fontSize: '1rem', marginBottom: '0.5rem' }}>Response Time</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Within 24-48 hours</p>
            </div>
          </div>
        </section>

        {/* Google Map Section */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--accent)', marginBottom: '1rem', textAlign: 'center' }}>
            🏟️ Where You Can Find Me
          </h2>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-strong)',
            border: '1px solid var(--border-soft)'
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3853.960058524246!2d120.98251241535696!3d14.53537408810882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b7a4c5b1f1fb%3A0x520e2a1f0d2e1234!2sMall%20of%20Asia%20Arena!5e0!3m2!1sen!2sph!4v1670000000000!5m2!1sen!2sph"
              width="100%" 
              height="350"
              style={{ 
                border: 0,
                display: 'block'
              }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Mall of Asia Arena Map"
            />
            <div style={{
              padding: '1rem',
              background: 'var(--bg-surface)',
              borderTop: '1px solid var(--border-soft)',
              textAlign: 'center'
            }}>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--accent)' }}>📍 Mall of Asia Arena</strong>
                <br />
                Pasay, Metro Manila, Philippines
                <br />
                <small>Catch me during major Dota 2 tournaments!</small>
              </p>
            </div>
          </div>
        </section>

        {/* Resources Table */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--accent)', marginBottom: '1rem', textAlign: 'center' }}>
            📚 Essential Dota 2 Resources
          </h2>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'var(--bg-card)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-soft)',
              border: '1px solid var(--border-soft)'
            }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-glow))' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'black' }}>🎯 Resource Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'black' }}>📖 Description</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                    <a href="https://www.dotabuff.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                      Dotabuff
                    </a>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                    A comprehensive stats and analytics platform for Dota 2 players.
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-soft)' }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                    <a href="https://www.reddit.com/r/DotA2/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                      Reddit
                    </a>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                    A community hub for Dota 2 discussions, strategies, and memes.
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                    <a href="https://discord.com/invite/dota2" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                      Discord
                    </a>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                    Real-time chat with the Dota 2 community.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Image Section */}
        <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="image-container">
            <img 
              src="/assets/087a1888-3028-466a-8277-ce240a307980.jfif" 
              alt="Dota 2 Gameplay"
              style={{
                maxWidth: '100%',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-strong)',
                border: '1px solid var(--border-soft)'
              }}
              onError={(e) => {
                e.target.src = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/backgrounds/radiant_dire.jpg';
              }}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default ContactPage;