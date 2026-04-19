// src/pages/ProfilePage.js
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [pic, setPic] = useState(null);
  const [picPreview, setPicPreview] = useState(null);
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    if (pic) fd.append('profilePic', pic);
    
    try {
      const { data } = await API.put('/auth/profile', fd);
      setUser(data);
      setMsg('Profile updated successfully!');
      setPicPreview(null);
      setPic(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      await API.put('/auth/change-password', { 
        currentPassword: curPw, 
        newPassword: newPw 
      });
      setMsg('Password changed successfully!');
      setCurPw('');
      setNewPw('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error changing password');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPic(file);
      setPicPreview(URL.createObjectURL(file));
    }
  };

  const picSrc = user?.profilePic && !picPreview
    ? `http://localhost:5000/uploads/${user.profilePic}`
    : picPreview || '/default-avatar.png';

  return (
    <div className="container">
      <div className="profile-page">
        <div className="profile-header">
          <img src={picSrc} alt="Profile" className="profile-pic-preview" />
          <h2>{user?.name}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
          <p style={{ color: 'var(--accent)' }}>Role: {user?.role}</p>
        </div>

        {msg && <div className="success-msg">{msg}</div>}
        {error && <div className="error-msg">{error}</div>}

        <div className="profile-section">
          <h3>✏️ Edit Profile</h3>
          <form onSubmit={handleProfile}>
            <label>Display Name</label>
            <input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Your display name"
              required
            />
            
            <label>Bio</label>
            <textarea 
              value={bio} 
              onChange={e => setBio(e.target.value)} 
              placeholder="Tell us about yourself..."
              rows={4}
            />
            
            <label>Profile Picture</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
            />
            
            <button type="submit">Save Profile</button>
          </form>
        </div>

        <div className="profile-section">
          <h3>🔐 Change Password</h3>
          <form onSubmit={handlePassword}>
            <label>Current Password</label>
            <input 
              type="password" 
              placeholder="Enter current password"
              value={curPw} 
              onChange={e => setCurPw(e.target.value)} 
              required 
            />
            
            <label>New Password</label>
            <input 
              type="password" 
              placeholder="Minimum 6 characters"
              value={newPw} 
              onChange={e => setNewPw(e.target.value)} 
              required 
              minLength="6"
            />
            
            <button type="submit">Change Password</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;