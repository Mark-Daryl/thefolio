// src/pages/AdminPage.js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import AdminMessages from '../components/AdminMessages';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [tab, setTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    fetchData();
    fetchUnreadCount();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, postsRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/posts')
      ]);
      setUsers(usersRes.data);
      setPosts(postsRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const { data } = await API.get('/contact/messages/unread/count');
      setMessageCount(data.count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/status`);
      setUsers(users.map(u => u._id === id ? data.user : u));
    } catch (err) {
      alert('Failed to update user status');
    }
  };

  const removePost = async (id) => {
    if (!window.confirm('Remove this post? It can be restored later.')) return;
    
    try {
      await API.put(`/admin/posts/${id}/remove`);
      setPosts(posts.map(p => p._id === id ? { ...p, status: 'removed' } : p));
    } catch (err) {
      alert('Failed to remove post');
    }
  };

  if (loading) return <div className="loading-spinner">Loading dashboard...</div>;

  return (
    <div className="container">
      <div className="admin-page">
        <h2 className="text-center">👑 Admin Dashboard</h2>
        <p className="text-center" style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Manage members, posts, and contact messages
        </p>
        
        <div className="admin-tabs">
          <button 
            onClick={() => setTab('users')} 
            className={tab === 'users' ? 'active' : ''}
          >
            👥 Members ({users.length})
          </button>
          <button 
            onClick={() => setTab('posts')} 
            className={tab === 'posts' ? 'active' : ''}
          >
            📝 All Posts ({posts.length})
          </button>
          <button 
            onClick={() => setTab('messages')} 
            className={tab === 'messages' ? 'active' : ''}
          >
            📬 Messages {messageCount > 0 && <span className="unread-badge">{messageCount}</span>}
          </button>
        </div>

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="admin-users">
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>👥 Member Management</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">No members found</td>
                    </tr>
                  ) : (
                    users.map(u => (
                      <tr key={u._id}>
                        <td>
                          {u.profilePic ? (
                            <img 
                              src={`http://localhost:5000/uploads/${u.profilePic}`}
                              alt={u.name}
                              className="author-avatar"
                              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ 
                              width: '40px', 
                              height: '40px', 
                              borderRadius: '50%', 
                              background: 'var(--accent)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#000'
                            }}>
                              {u.name.charAt(0)}
                            </div>
                          )}
                        </td>
                        <td>
                          <strong>{u.name}</strong>
                          {u.bio && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.bio.substring(0, 50)}</div>}
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`status-badge ${u.role === 'admin' ? 'active' : 'published'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${u.status}`}>
                            {u.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <button 
                            onClick={() => toggleStatus(u._id)}
                            className={u.status === 'active' ? 'btn-danger' : 'btn-success'}
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                          >
                            {u.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {tab === 'posts' && (
          <div className="admin-posts">
            <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>📝 Post Management</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">No posts found</td>
                    </tr>
                  ) : (
                    posts.map(p => (
                      <tr key={p._id}>
                        <td>
                          {p.image ? (
                            <img 
                              src={`http://localhost:5000/uploads/${p.image}`}
                              alt={p.title}
                              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                          ) : (
                            <div style={{ width: '50px', height: '50px', background: 'var(--bg-surface)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              📄
                            </div>
                          )}
                        </td>
                        <td>
                          <Link to={`/posts/${p._id}`} style={{ color: 'var(--accent)' }}>
                            <strong>{p.title}</strong>
                          </Link>
                        </td>
                        <td>
                          {p.author?.name || 'Unknown'}
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {p.author?.email}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <span className={`status-badge ${p.status}`}>
                            {p.status === 'published' ? '📗 Published' : '🗑️ Removed'}
                          </span>
                        </td>
                        <td>
                          {p.status === 'published' && (
                            <button 
                              onClick={() => removePost(p._id)}
                              className="btn-danger"
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                            >
                              Remove
                            </button>
                          )}
                          {p.status === 'removed' && (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Archived</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {tab === 'messages' && (
          <AdminMessages onUnreadUpdate={fetchUnreadCount} />
        )}
      </div>
    </div>
  );
};

export default AdminPage;