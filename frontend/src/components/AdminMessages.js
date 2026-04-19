// src/components/AdminMessages.js
import { useState, useEffect } from 'react';
import API from '../api/axios';

const AdminMessages = ({ onUnreadUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, read, replied

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await API.get('/contact/messages');
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/contact/messages/${id}/read`);
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, status: 'read' } : msg
      ));
      if (onUnreadUpdate) onUnreadUpdate();
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) return;
    
    setReplyLoading(true);
    try {
      const { data } = await API.post(`/contact/messages/${id}/reply`, { 
        reply: replyText 
      });
      
      setMessages(messages.map(msg => 
        msg._id === id ? data.data : msg
      ));
      
      setReplyText('');
      setSelectedMessage(null);
      if (onUnreadUpdate) onUnreadUpdate();
      alert('✅ Reply sent successfully!');
    } catch (err) {
      console.error('Error sending reply:', err);
      alert('❌ Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await API.delete(`/contact/messages/${id}`);
      setMessages(messages.filter(msg => msg._id !== id));
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
      if (onUnreadUpdate) onUnreadUpdate();
      alert('✅ Message deleted successfully');
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('❌ Failed to delete message');
    }
  };

  const getFilteredMessages = () => {
    if (filter === 'all') return messages;
    return messages.filter(msg => msg.status === filter);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'unread':
        return <span className="status-badge" style={{ background: '#e53935', color: 'white' }}>📬 Unread</span>;
      case 'read':
        return <span className="status-badge" style={{ background: '#ff9800', color: 'white' }}>👁️ Read</span>;
      case 'replied':
        return <span className="status-badge" style={{ background: '#4caf50', color: 'white' }}>✅ Replied</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading messages...</div>;
  }

  return (
    <div>
      <div className="admin-messages-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h3 style={{ color: 'var(--accent)' }}>📬 Contact Messages</h3>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'active' : ''}
            style={{ padding: '0.5rem 1rem', marginTop: 0 }}
          >
            All ({messages.length})
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={filter === 'unread' ? 'active' : ''}
            style={{ padding: '0.5rem 1rem', marginTop: 0 }}
          >
            Unread ({messages.filter(m => m.status === 'unread').length})
          </button>
          <button 
            onClick={() => setFilter('read')}
            className={filter === 'read' ? 'active' : ''}
            style={{ padding: '0.5rem 1rem', marginTop: 0 }}
          >
            Read ({messages.filter(m => m.status === 'read').length})
          </button>
          <button 
            onClick={() => setFilter('replied')}
            className={filter === 'replied' ? 'active' : ''}
            style={{ padding: '0.5rem 1rem', marginTop: 0 }}
          >
            Replied ({messages.filter(m => m.status === 'replied').length})
          </button>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No messages yet. When users contact you, they'll appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Messages List */}
          <div>
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {getFilteredMessages().map(message => (
                <div 
                  key={message._id}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (message.status === 'unread') {
                      markAsRead(message._id);
                    }
                  }}
                  style={{
                    background: selectedMessage?._id === message._id ? 'var(--bg-surface)' : 'var(--bg-card)',
                    padding: '1rem',
                    marginBottom: '1rem',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    border: selectedMessage?._id === message._id ? `2px solid var(--accent)` : `1px solid var(--border-soft)`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--accent)' }}>{message.name}</strong>
                    {getStatusBadge(message.status)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    📧 {message.email}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    🕐 {new Date(message.createdAt).toLocaleString()}
                  </div>
                  <div style={{ 
                    marginTop: '0.5rem', 
                    color: 'var(--text-main)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    💬 {message.message.substring(0, 100)}...
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Details & Reply */}
          <div>
            {selectedMessage ? (
              <div style={{
                background: 'var(--bg-card)',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid var(--border-soft)',
                position: 'sticky',
                top: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <h4 style={{ color: 'var(--accent)' }}>📋 Message Details</h4>
                  <button 
                    onClick={() => deleteMessage(selectedMessage._id)}
                    className="btn-danger"
                    style={{ padding: '0.3rem 0.8rem', marginTop: 0 }}
                  >
                    🗑️ Delete
                  </button>
                </div>
                
                <div style={{ marginBottom: '1rem', padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                  <strong>👤 From:</strong> {selectedMessage.name}
                </div>
                <div style={{ marginBottom: '1rem', padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                  <strong>📧 Email:</strong> <a href={`mailto:${selectedMessage.email}`} style={{ color: 'var(--accent)' }}>{selectedMessage.email}</a>
                </div>
                <div style={{ marginBottom: '1rem', padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                  <strong>🕐 Sent:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}
                </div>
                <div style={{ marginBottom: '1rem', padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                  <strong>📌 Status:</strong> {getStatusBadge(selectedMessage.status)}
                </div>
                
                <div style={{ 
                  marginBottom: '1.5rem', 
                  padding: '1rem', 
                  background: 'var(--bg-surface)', 
                  borderRadius: '12px',
                  borderLeft: `3px solid var(--accent)`
                }}>
                  <strong>💬 Message:</strong>
                  <p style={{ marginTop: '0.5rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {selectedMessage.message}
                  </p>
                </div>
                
                {selectedMessage.reply && (
                  <div style={{ 
                    marginBottom: '1.5rem', 
                    padding: '1rem', 
                    background: 'rgba(76, 175, 80, 0.1)', 
                    borderRadius: '12px',
                    borderLeft: `3px solid #4caf50`
                  }}>
                    <strong style={{ color: '#4caf50' }}>✅ Your Reply:</strong>
                    <p style={{ marginTop: '0.5rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                      {selectedMessage.reply}
                    </p>
                    <small style={{ color: 'var(--text-muted)' }}>
                      Replied on: {new Date(selectedMessage.repliedAt).toLocaleString()}
                    </small>
                  </div>
                )}
                
                <div>
                  <strong>✏️ Reply to {selectedMessage.name}:</strong>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="4"
                    style={{
                      width: '100%',
                      marginTop: '0.5rem',
                      padding: '0.75rem',
                      background: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-strong)',
                      borderRadius: '8px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                  <button 
                    onClick={() => handleReply(selectedMessage._id)}
                    disabled={replyLoading || !replyText.trim()}
                    style={{ marginTop: '1rem' }}
                  >
                    {replyLoading ? 'Sending...' : '📤 Send Reply'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '16px' }}>
                <p>📭 Select a message from the left to view details and reply</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;