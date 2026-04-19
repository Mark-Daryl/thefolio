// src/pages/RegisterPage.js
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const RegisterPage = () => {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '',
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Email validation function
  const validateEmail = (email) => {
    // Check if email contains @ and .com
    const hasAtSymbol = email.includes('@');
    const hasDotCom = email.includes('.com');
    
    if (!hasAtSymbol) {
      return 'Email must contain "@" symbol';
    }
    if (!hasDotCom) {
      return 'Email must end with ".com"';
    }
    // Additional check that .com comes after @
    const atIndex = email.indexOf('@');
    const dotComIndex = email.lastIndexOf('.com');
    if (dotComIndex < atIndex) {
      return '".com" must come after "@" in email';
    }
    return '';
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
    
    // Clear error for this field when user types
    if (errors[id]) {
      setErrors({ ...errors, [id]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailError = validateEmail(form.email);
      if (emailError) {
        newErrors.email = emailError;
      }
    }
    
    // Password validation
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm Password validation
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      // Only send name, email, password to backend (not confirmPassword)
      const { data } = await API.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password
      });
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setErrors({ 
        submit: err.response?.data?.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2 className="text-center">Create Account</h2>
        <p className="text-center" style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Join TheFolio community
        </p>
        
        {/* Submit Error */}
        {errors.submit && <div className="error-msg">{errors.submit}</div>}
        
        {/* Name Field */}
        <label>👤 Full Name</label>
        <input 
          id="name"
          type="text"
          placeholder="Juan Dela Cruz"
          value={form.name} 
          onChange={handleChange} 
          className={errors.name ? 'invalid' : ''}
          disabled={loading}
        />
        {errors.name && <span className="error">{errors.name}</span>}
        
        {/* Email Field */}
        <label>📧 Email Address</label>
        <input 
          id="email"
          type="email" 
          placeholder="you@example.com"
          value={form.email} 
          onChange={handleChange} 
          className={errors.email ? 'invalid' : ''}
          disabled={loading}
        />
        {errors.email && <span className="error">{errors.email}</span>}
        <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
          Email must contain "@" and end with ".com"
        </small>
        
        {/* Password Field */}
        <label>🔒 Password</label>
        <div className="password-wrapper">
          <input 
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Minimum 6 characters"
            value={form.password} 
            onChange={handleChange} 
            className={errors.password ? 'invalid' : ''}
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
        {errors.password && <span className="error">{errors.password}</span>}
        
        {/* Confirm Password Field */}
        <label>🔒 Confirm Password</label>
        <div className="password-wrapper">
          <input 
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={form.confirmPassword} 
            onChange={handleChange} 
            className={errors.confirmPassword ? 'invalid' : ''}
            disabled={loading}
          />
          <span 
            className="toggle-eye" 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ cursor: 'pointer' }}
          >
            {showConfirmPassword ? "👁️" : "🔒"}
          </span>
        </div>
        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
        
        <p className="text-center" style={{ marginTop: '1rem' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;