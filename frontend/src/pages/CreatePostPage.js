// src/pages/CreatePostPage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('guide');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, PNG, GIF, and WEBP images are allowed');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  // Example Post Template - Invoker Guide
  const loadExamplePost = () => {
    setTitle("Invoker: The Ultimate Guide to Mastering All 10 Spells");
    setCategory("guide");
    setBody(`# 🎯 Introduction

Invoker is arguably the most complex hero in Dota 2, requiring mastery of 10 different spells and perfect timing. This guide will help you understand the basics and advanced techniques.

## 🔥 Why Play Invoker?

- **High Skill Ceiling**: Never stop learning and improving
- **Versatile Gameplay**: Can be played as pos 2, 3, or even 4
- **Game-Changing Impact**: One well-executed combo can win teamfights

## 📜 Spell Combinations

### Early Game (Levels 1-7)
- **Cold Snap + Forged Spirit**: Your bread and butter harassment combo
- **Tornado + EMP**: Mana drain setup for lane control

### Mid Game (Levels 8-12)
- **Tornado + Meteor + Deafening Blast**: The classic "Tornado Meatball" combo
- **Ice Wall + Cold Snap**: Excellent for chasing and kiting

### Late Game (Levels 13+)
- **Sun Strike**: Global presence and securing kills
- **Ghost Walk**: Escape or chase with invisibility

## 🛒 Item Builds

### Core Items (Always useful)
1. **Hand of Midas** - Accelerate your leveling
2. **Aghanim's Scepter** - Unlock Cataclysm (double Sun Strike)
3. **Blink Dagger** - Positioning is everything

### Situational Items
- **Black King Bar** - Against heavy magic damage
- **Scythe of Vyse** - Extra disable for key targets
- **Refresher Orb** - Double the spells, double the chaos!

## ⚔️ Laning Stage Tips

1. **Secure last hits** with Exort orbs
2. **Harass** with Cold Snap + Forged Spirit
3. **Control runes** using Ghost Walk
4. **Stack camps** with Forged Spirit while laning

## 🎮 Teamfight Positioning

> "The best Invoker players are invisible until they need to strike."

- Stay in the **backlines** during initiation
- Use **Tornado** to disrupt enemy channeling
- **Deafening Blast** to disarm right-click carries
- Save **Ghost Walk** as an escape mechanism

## 📊 Skill Build Order

| Level | Spell Unlocked | Orbs to Invoke |
|-------|----------------|----------------|
| 2 | Cold Snap | QQQ |
| 3 | Forged Spirit | QQE |
| 5 | Tornado | WQW |
| 7 | EMP | WWW |
| 9 | Meteor | EEE |
| 11 | Deafening Blast | QWE |

## 🏆 Pro Tips from High-MMR Players

1. **Practice spell combos** in demo mode for 10 minutes daily
2. **Use quick-cast** for faster reactions
3. **Memorize orb combinations** until they become muscle memory
4. **Watch replays** of Topson, Miracle-, and Sumiya

## ❌ Common Mistakes to Avoid

- Don't try to use all spells in every fight
- Don't forget to invoke spells before fights start
- Don't skip BKB when needed
- Don't overextend for Sun Strike kills

## 🎬 Conclusion

Invoker is a hero that rewards dedication and practice. Start with basic combos, master them, then gradually add more spells to your arsenal. Remember: even professional players are still learning new tricks with this hero!

---

*What's your favorite Invoker combo? Share in the comments below!*`);
    setShowExample(false);
    setError('');
  };

  // Example Post Template - Patch Analysis
  const loadPatchExample = () => {
    setTitle("7.35 Patch Analysis: Biggest Changes and Meta Shifts");
    setCategory("patch");
    setBody(`# 📊 7.35 Patch Analysis

The latest Dota 2 patch has brought significant changes to the meta. Here's my detailed analysis of the most impactful updates.

## 🔄 Major Hero Changes

### Buffed Heroes
- **Invoker**: +15 base damage, reduced mana cost on spells
- **Phantom Assassin**: Coup de Grace now has 20% chance at level 1
- **Earth Spirit**: Reduced cooldown on all abilities

### Nerfed Heroes
- **Pudge**: Meat Hook range reduced by 100
- **Anti-Mage**: Blink range reduced from 1150 to 1000
- **Storm Spirit**: Ball Lightning mana cost increased

## 🛠️ Item Changes

| Item | Old | New | Impact |
|------|-----|-----|--------|
| Blink Dagger | 2250 gold | 2000 gold | 🟢 More accessible |
| BKB | 90s cd | 75s cd | 🟢 Better uptime |
| Manta Style | 3000 gold | 3200 gold | 🔴 Slightly nerfed |

## 🗺️ Map Changes

- Roshan now spawns at 15 minutes
- Outposts give vision only (no XP)
- New jungle camps added near safelane

## 💡 My Predictions

1. **Invoker will be top-tier** mid laner
2. **Deathball push strategies** will return
3. **Support role** becomes more impactful early game

## 🎯 Conclusion

This patch rewards aggressive play and early fighting. Adjust your playstyle accordingly!`);
    setShowExample(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validation
    if (!title.trim()) {
      setError('Please enter a title');
      setLoading(false);
      return;
    }
    
    if (!body.trim()) {
      setError('Please enter some content');
      setLoading(false);
      return;
    }
    
    if (title.length < 5) {
      setError('Title must be at least 5 characters');
      setLoading(false);
      return;
    }
    
    if (body.length < 20) {
      setError('Content must be at least 20 characters');
      setLoading(false);
      return;
    }
    
    const fd = new FormData();
    fd.append('title', `[${category.toUpperCase()}] ${title}`);
    fd.append('body', body);
    if (image) fd.append('image', image);
    
    try {
      const { data } = await API.post('/posts', fd);
      navigate(`/posts/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish post');
      setLoading(false);
    }
  };

  const clearForm = () => {
    if (window.confirm('Are you sure you want to clear all form data?')) {
      setTitle('');
      setBody('');
      setCategory('guide');
      setImage(null);
      setImagePreview(null);
      setError('');
    }
  };

  return (
    <div className="container">
      <div className="create-post-page">
        <h2 className="text-center">✍️ Write a Dota 2 Post</h2>
        <p className="text-center" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Share your strategies, hero guides, or epic moments with the community
        </p>
        
        {/* Example Post Buttons - Only show when form is empty */}
        {!title && !body && (
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <button 
              type="button"
              onClick={() => setShowExample(!showExample)}
              style={{ 
                background: 'transparent', 
                border: '1px solid var(--accent)',
                marginRight: '1rem'
              }}
            >
              {showExample ? 'Hide Examples' : '📋 View Example Templates'}
            </button>
          </div>
        )}
        
        {/* Example Post Preview */}
        {showExample && (
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: '1px solid var(--accent)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowExample(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                fontSize: '1.2rem',
                padding: '0.3rem 0.6rem',
                marginTop: 0
              }}
            >
              ✕
            </button>
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>📖 Example Templates</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {/* Hero Guide Example */}
              <div style={{ 
                padding: '1rem', 
                background: 'var(--bg-surface)', 
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              onClick={loadExamplePost}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                <h4 style={{ color: 'var(--accent)' }}>Hero Guide</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Complete guide for Invoker including spell combos, item builds, and positioning tips.
                </p>
                <small style={{ color: 'var(--accent)' }}>Click to use →</small>
              </div>
              
              {/* Patch Analysis Example */}
              <div style={{ 
                padding: '1rem', 
                background: 'var(--bg-surface)', 
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              onClick={loadPatchExample}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                <h4 style={{ color: 'var(--accent)' }}>Patch Analysis</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Analyze latest patches, hero changes, item updates, and meta shifts.
                </p>
                <small style={{ color: 'var(--accent)' }}>Click to use →</small>
              </div>
            </div>
          </div>
        )}
        
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Category Selection */}
          <label>📂 Post Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="guide">🎯 Hero Guide</option>
            <option value="strategy">🏰 Strategy & Tactics</option>
            <option value="patch">📊 Patch Analysis</option>
            <option value="esports">🏆 Esports & Tournaments</option>
            <option value="story">📖 Personal Story</option>
            <option value="tips">💡 Tips & Tricks</option>
          </select>
          
          {/* Title Input */}
          <label>📝 Title</label>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g., Invoker: The Ultimate Combo Guide"
            maxLength="100"
            required 
          />
          <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            {title.length}/100 characters
          </small>
          
          {/* Content Input */}
          <label>📖 Content (Markdown supported)</label>
          <textarea 
            value={body} 
            onChange={e => setBody(e.target.value)} 
            placeholder={`Write your post here...

Example structure:
# Title
## Subtitle
- Bullet points
- Lists
- Tips

**Bold text** for emphasis

> Quotes from pro players

Share your knowledge with the community!`}
            rows={15} 
            required 
          />
          <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            {body.length} characters (minimum 20)
          </small>
          
          {/* Preview of what the post will look like */}
          {body.length > 100 && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'var(--bg-surface)',
              borderRadius: '8px',
              borderLeft: `3px solid var(--accent)`
            }}>
              <strong>📄 Live Preview:</strong>
              <div style={{ 
                fontSize: '0.9rem', 
                color: 'var(--text-muted)',
                maxHeight: '150px',
                overflowY: 'auto',
                marginTop: '0.5rem',
                padding: '0.5rem',
                background: 'var(--bg-card)',
                borderRadius: '8px'
              }}>
                {body.split('\n').slice(0, 5).map((line, i) => (
                  <p key={i}>{line || <br />}</p>
                ))}
                {body.split('\n').length > 5 && <em>...</em>}
              </div>
            </div>
          )}
          
          {/* Image Upload - Available for ALL users (optional) */}
          <div>
            <label>🖼️ Featured Image (Optional)</label>
            <input 
              type="file" 
              accept="image/jpeg, image/jpg, image/png, image/gif, image/webp" 
              onChange={handleImageChange}
            />
            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
              Add an image to make your post more engaging (optional, max 5MB)
            </small>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '0.2rem 0.5rem',
                    background: 'var(--danger)',
                    fontSize: '0.8rem'
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" disabled={loading}>
              {loading ? 'Publishing...' : '🚀 Publish Post'}
            </button>
            <button 
              type="button"
              onClick={clearForm}
              style={{ background: 'transparent', border: '1px solid var(--border-strong)' }}
            >
              🗑️ Clear Form
            </button>
          </div>
        </form>
        
        {/* Writing Tips Section */}
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-soft)'
        }}>
          <h4 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>💡 Tips for Writing Great Dota 2 Posts:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div>
              <strong style={{ color: 'var(--accent)' }}>📝 Structure</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <li>Use headings (#, ##, ###)</li>
                <li>Break text into sections</li>
                <li>Include bullet points for lists</li>
                <li>Add timestamps for patches</li>
              </ul>
            </div>
            <div>
              <strong style={{ color: 'var(--accent)' }}>🎯 Content</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <li>Share specific match IDs</li>
                <li>Use **bold** for important items</li>
                <li>Add &gt; quotes for insights</li>
                <li>Include personal experiences</li>
              </ul>
            </div>
            <div>
              <strong style={{ color: 'var(--accent)' }}>🎮 Engagement</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <li>Ask questions at the end</li>
                <li>Encourage discussion</li>
                <li>Share your MMR/rank</li>
                <li>Update posts for new patches</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Category Benefits */}
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'rgba(255, 109, 0, 0.1)',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid var(--accent)'
        }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            ✨ <strong style={{ color: 'var(--accent)' }}>Pro Tip:</strong> Posts with images get 3x more engagement! 
            Choose a relevant screenshot or hero artwork to make your post stand out.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;