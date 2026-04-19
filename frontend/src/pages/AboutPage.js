// src/pages/AboutPage.js
import { Link } from 'react-router-dom';


function AboutPage() {
  return (
    <>
      {/* Hero Section for About Page */}
      <div className="hero-section" style={{ minHeight: '40vh', padding: '3rem 2rem' }}>
        <div className="container">
          <h1 className="hero-title">My Journey with Dota 2</h1>
          <p className="hero-subtitle">
            From a curious newcomer to an Ancient Apparition veteran
          </p>
        </div>
      </div>

      <div className="container">
        {/* Story Section - Image on Right, Text on Left */}
        <section style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '3rem', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h2 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>⚔️ The Beginning</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
              I began my journey with Dota 2 through curiosity and a love for interactive digital worlds. 
              What started as a simple game quickly became a passion for strategy, teamwork, and mastery.
            </p>
            
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>🏆 My Dota 2 Milestones</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>✓</span>
                Discovered the depth of heroes and mechanics
              </li>
              <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>✓</span>
                Learned strategy, teamwork, and decision-making
              </li>
              <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>✓</span>
                Explored evolving metas and balance changes
              </li>
              <li style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>✓</span>
                Experienced player-driven stories through each match
              </li>
            </ul>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <img 
              src="https://sm.ign.com/t/ign_za/articlepage/v/valve-planning-new-original-heroes-for-dota-2/valve-planning-new-original-heroes-for-dota-2_5dnp.1280.jpg"
              alt="Dota 2 Heroes"
              style={{ 
                width: '100%', 
                height: 'auto',
                minHeight: '300px',
                objectFit: 'cover',
                borderRadius: '16px', 
                boxShadow: 'var(--shadow-strong)'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500x300/1a1d26/ff6d00?text=Dota+2+Heroes';
              }}
            />
          </div>
        </section>

        {/* Second Section - Image on Left, Text on Right */}
        <section style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '3rem', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <img 
              src="https://cdn.mos.cms.futurecdn.net/15d77350aa34c9a357cdfa7bd7acf45e-1200-80.jpg"
              alt="Radiant vs Dire"
              style={{ 
                width: '100%', 
                height: 'auto',
                minHeight: '300px',
                objectFit: 'cover',
                borderRadius: '16px', 
                boxShadow: 'var(--shadow-strong)'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500x300/1a1d26/ff6d00?text=Radiant+vs+Dire';
              }}
            />
          </div>
          
          <div>
            <h2 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>💚 What I Love About Dota</h2>
            <blockquote style={{ 
              fontStyle: 'italic', 
              fontSize: '1.2rem', 
              padding: '1rem 2rem',
              borderLeft: `4px solid var(--accent)`,
              margin: '1rem 0',
              background: 'var(--bg-surface)',
              borderRadius: '12px'
            }}>
              "Games are the most elevated form of investigation." – Albert Einstein
            </blockquote>
            <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
              Dota 2 isn't just a game—it's a constantly evolving universe where every match tells a unique story. 
              The thrill of a well-executed team fight, the satisfaction of mastering a complex hero, 
              and the camaraderie built with teammates make every hour spent worthwhile.
            </p>
            
            <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: '12px' }}>
              <h3 style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>🎮 Current Goals</h3>
              <p>Reach Immortal rank • Master Invoker • Create helpful guides for new players</p>
            </div>
            
            <Link to="/create-post">
              <button style={{ marginTop: '1.5rem' }}>Share Your Story →</button>
            </Link>
          </div>
        </section>

        {/* Stats Section - Full Width */}
        <section style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h2 style={{ color: 'var(--accent)', marginBottom: '2rem' }}>📊 My Dota 2 Stats</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '1.5rem',
            '@media (max-width: 768px)': {
              gridTemplateColumns: 'repeat(2, 1fr)'
            }
          }}>
            <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>2,500+</div>
              <div style={{ color: 'var(--text-muted)' }}>Hours Played</div>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--radiant)' }}>4,200</div>
              <div style={{ color: 'var(--text-muted)' }}>MMR Peak</div>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>120+</div>
              <div style={{ color: 'var(--text-muted)' }}>Heroes Played</div>
            </div>
            <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--gold)' }}>53%</div>
              <div style={{ color: 'var(--text-muted)' }}>Win Rate</div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default AboutPage;