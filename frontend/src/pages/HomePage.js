// src/pages/HomePage.js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState(null);

  useEffect(() => {
    API.get('/posts')
      .then(res => {
        setPosts(res.data);
        // Set the first post as featured if exists
        if (res.data.length > 0) {
          setFeaturedPost(res.data[0]);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">⚔️ Loading Ancient Stories ⚔️</div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
            <img 
      src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/logo.png"
      alt="Dota 2 Logo"
      style={{ 
        width: '120px', 
        marginBottom: '1rem',
        animation: 'pulse 2s infinite'
      }}
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
          <h1 className="hero-title">Welcome to My Dota 2 Journey</h1>
          <p className="hero-subtitle">
            I explore creativity, technology, and storytelling through interactive
            digital worlds, and Dota 2 exemplifies this intersection through strategy,
            mastery, and competitive depth.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <Link to="/create-post">
              <button style={{ marginRight: '1rem' }}>⚔️ Share Your Story</button>
            </Link>
            <Link to="/about">
              <button style={{ background: 'transparent', border: '2px solid var(--accent)' }}>
                📖 Learn More
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Featured Post Section */}
        {featuredPost && (
          <section style={{ 
            background: 'linear-gradient(135deg, var(--bg-card), var(--bg-surface))',
            border: '1px solid var(--accent)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              background: 'var(--accent)', 
              padding: '0.5rem 1rem', 
              borderRadius: '0 0 0 12px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              color: '#000'
            }}>
              🌟 Featured
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
              {featuredPost.image && (
                <img 
                  src={`http://localhost:5000/uploads/${featuredPost.image}`} 
                  alt={featuredPost.title}
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-strong)'
                  }}
                />
              )}
              <div>
                <span className="post-category">🏆 Editor's Pick</span>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--accent)' }}>
                  {featuredPost.title}
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  {featuredPost.body.substring(0, 200)}...
                </p>
                <div className="post-meta" style={{ marginBottom: '1rem' }}>
                  <span>By {featuredPost.author?.name || 'Anonymous'}</span>
                  <span>{new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                </div>
                <Link to={`/posts/${featuredPost._id}`}>
                  <button>Read Full Story →</button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Why Dota 2? Section */}
        <section>
          <h2 style={{ color: 'var(--accent)', marginBottom: '1.5rem', textAlign: 'center' }}>
            ⚔️ Why Dota 2?
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '1.5rem',
            marginTop: '1rem'
          }}>
            <div style={{ 
              background: 'var(--bg-card)', 
              padding: '1.5rem', 
              borderRadius: '16px',
              textAlign: 'center',
              border: '1px solid var(--border-soft)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏔️</div>
              <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>High Skill Ceiling</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Meaningful mastery with endless possibilities for improvement
              </p>
            </div>
            
            <div style={{ 
              background: 'var(--bg-card)', 
              padding: '1.5rem', 
              borderRadius: '16px',
              textAlign: 'center',
              border: '1px solid var(--border-soft)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>♟️</div>
              <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Strategic Complexity</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Every decision matters in this deep tactical experience
              </p>
            </div>
            
            <div style={{ 
              background: 'var(--bg-card)', 
              padding: '1.5rem', 
              borderRadius: '16px',
              textAlign: 'center',
              border: '1px solid var(--border-soft)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎮</div>
              <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Player Agency</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Emergent gameplay that rewards creativity and adaptation
              </p>
            </div>
            
            <div style={{ 
              background: 'var(--bg-card)', 
              padding: '1.5rem', 
              borderRadius: '16px',
              textAlign: 'center',
              border: '1px solid var(--border-soft)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏆</div>
              <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>Competitive Thrill</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Emotionally engaging competition at every level
              </p>
            </div>
          </div>
        </section>

        {/* Latest Posts Section */}
        <section>
          <h2 style={{ color: 'var(--accent)', marginBottom: '1.5rem', textAlign: 'center' }}>
            📜 Latest from the Ancient
          </h2>
          
          {posts.length === 0 ? (
            <div className="empty-state">
              <p>No posts yet. Be the first to share your Dota 2 journey!</p>
              <Link to="/create-post" className="read-more">Write Your First Post →</Link>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.slice(0, 6).map(post => (
                <article key={post._id} className="post-card">
                  {post.image && (
                    <img 
                      src={`http://localhost:5000/uploads/${post.image}`} 
                      alt={post.title}
                      className="post-card-image"
                    />
                  )}
                  <div className="post-card-content">
                    <span className="post-category">🎮 Dota 2</span>
                    <h3>
                      <Link to={`/posts/${post._id}`}>{post.title}</Link>
                    </h3>
                    <div className="post-meta">
                      <span className="post-author">
                        {post.author?.profilePic && (
                          <img 
                            src={`http://localhost:5000/uploads/${post.author.profilePic}`}
                            alt={post.author.name}
                            className="author-avatar"
                            style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                          />
                        )}
                        {post.author?.name || 'Anonymous'}
                      </span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="post-excerpt">
                      {post.body.substring(0, 120)}...
                    </p>
                    <Link to={`/posts/${post._id}`} className="read-more">
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
          
          {posts.length > 6 && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/posts">
                <button>View All Posts →</button>
              </Link>
            </div>
          )}
        </section>

        {/* Community Stats Section */}
        <section style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>
            🌍 The Dota 2 Community
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '1.5rem'
          }}>
            <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>100+</div>
              <div style={{ color: 'var(--text-muted)' }}>Unique Heroes</div>
              <small style={{ color: 'var(--text-muted)' }}>Endless combinations</small>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>10M+</div>
              <div style={{ color: 'var(--text-muted)' }}>Monthly Players</div>
              <small style={{ color: 'var(--text-muted)' }}>Global community</small>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>$40M+</div>
              <div style={{ color: 'var(--text-muted)' }}>Tournament Prizes</div>
              <small style={{ color: 'var(--text-muted)' }}>The International</small>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section style={{ 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, var(--bg-card), var(--bg-surface))',
          border: '1px solid var(--accent)'
        }}>
          <h2 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>
            Ready to Share Your Story?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
            Join the community and share your Dota 2 experiences, strategies, and epic moments
          </p>
          <Link to="/create-post">
            <button style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              ✍️ Start Writing Now
            </button>
          </Link>
        </section>
      </div>
    </>
  );
}

export default HomePage;