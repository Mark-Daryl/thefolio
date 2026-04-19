// src/pages/PostPage.js
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const PostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [replyBody, setReplyBody] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      const { data } = await API.get(`/posts/${id}`);
      setPost(data);
    } catch (err) {
      setError('Post not found');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const { data } = await API.get(`/comments/${id}`);
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [fetchPost, fetchComments]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    
    setSubmitting(true);
    try {
      const { data } = await API.post(`/comments/${id}`, { body: commentBody });
      setComments([data, ...comments]);
      setCommentBody('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (commentId) => {
    if (!replyBody[commentId]?.trim()) return;
    
    setSubmitting(true);
    try {
      const { data } = await API.post(`/comments/${commentId}/reply`, { 
        body: replyBody[commentId] 
      });
      
      // Update the comment with the new reply
      setComments(comments.map(comment => 
        comment._id === commentId ? data : comment
      ));
      
      setReplyBody({ ...replyBody, [commentId]: '' });
      setActiveReplyId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add reply');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  const deleteReply = async (commentId, replyId) => {
    if (!window.confirm('Delete this reply?')) return;
    
    try {
      await API.delete(`/comments/${commentId}/reply/${replyId}`);
      // Refresh comments to show updated state
      fetchComments();
    } catch (err) {
      setError('Failed to delete reply');
    }
  };

  const deletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await API.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  const canEdit = user && (user._id === post?.author?._id || user.role === 'admin');
  const canDelete = user && (user._id === post?.author?._id || user.role === 'admin');
  
  // Check if user can reply (post author or admin)
  const canReply = user && (user._id === post?.author?._id || user.role === 'admin');

  if (loading) return <div className="loading-spinner">Loading post...</div>;
  if (error) return <div className="error-msg text-center">{error}</div>;
  if (!post) return <div className="error-msg text-center">Post not found</div>;

  return (
    <div className="container">
      <div className="post-page">
        <article>
          <div className="post-header">
            <h1>{post.title}</h1>
            <div className="post-meta">
              <span className="post-author">
                {post.author?.profilePic && (
                  <img 
                    src={`http://localhost:5000/uploads/${post.author.profilePic}`}
                    alt={post.author.name}
                    className="author-avatar"
                  />
                )}
                By {post.author?.name || 'Anonymous'}
              </span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {post.image && (
            <img 
                src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}/uploads/${post.image}`} 
                alt={post.title}
                className="post-featured-image"
            />
            )}

          <div className="post-body">
            {post.body.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {canEdit && (
            <div className="post-actions">
              <Link to={`/edit-post/${post._id}`}>
                <button className="btn-edit">✏️ Edit Post</button>
              </Link>
              {canDelete && (
                <button onClick={deletePost} className="btn-delete">🗑️ Delete Post</button>
              )}
            </div>
          )}
        </article>

        <div className="comments-section">
          <h3>💬 Comments ({comments.length})</h3>
          
          {user ? (
            <form onSubmit={handleComment} className="comment-form">
              <textarea 
                value={commentBody}
                onChange={e => setCommentBody(e.target.value)}
                placeholder="Share your thoughts..."
                rows="3"
                required
              />
              <button type="submit" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="text-center">
              <Link to="/login">Login</Link> to join the conversation
            </p>
          )}

          {comments.length === 0 ? (
            <p className="empty-state">No comments yet. Be the first!</p>
          ) : (
            comments.map(comment => (
              <div key={comment._id} className="comment">
                <div className="comment-header">
                  {comment.author?.profilePic && (
                    <img 
                      src={`http://localhost:5000/uploads/${comment.author.profilePic}`}
                      alt={comment.author.name}
                      className="author-avatar"
                    />
                  )}
                  <span className="comment-author">{comment.author?.name}</span>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                  {(user?._id === comment.author?._id || user?.role === 'admin') && (
                    <button 
                      onClick={() => deleteComment(comment._id)}
                      className="delete-comment-btn"
                      style={{ marginLeft: 'auto', padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className="comment-body">
                  <p>{comment.body}</p>
                </div>
                
                {/* Reply Button - Only for post author or admin */}
                {canReply && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <button
                      onClick={() => setActiveReplyId(activeReplyId === comment._id ? null : comment._id)}
                      style={{ 
                        padding: '0.2rem 0.8rem', 
                        fontSize: '0.75rem', 
                        background: 'transparent',
                        border: '1px solid var(--accent)'
                      }}
                    >
                      {activeReplyId === comment._id ? 'Cancel' : '💬 Reply'}
                    </button>
                  </div>
                )}
                
                {/* Reply Form */}
                {activeReplyId === comment._id && canReply && (
                  <div style={{ marginTop: '1rem', marginLeft: '2rem' }}>
                    <textarea
                      value={replyBody[comment._id] || ''}
                      onChange={(e) => setReplyBody({ ...replyBody, [comment._id]: e.target.value })}
                      placeholder={`Reply to ${comment.author?.name}...`}
                      rows="2"
                      style={{ width: '100%', padding: '0.5rem' }}
                    />
                    <button
                      onClick={() => handleReply(comment._id)}
                      disabled={submitting || !replyBody[comment._id]?.trim()}
                      style={{ marginTop: '0.5rem', padding: '0.3rem 1rem', fontSize: '0.8rem' }}
                    >
                      {submitting ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                )}
                
                {/* Display Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div style={{ marginLeft: '2rem', marginTop: '1rem', borderLeft: '2px solid var(--accent)', paddingLeft: '1rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>Replies:</strong>
                    {comment.replies.map(reply => (
                      <div key={reply._id} className="comment" style={{ marginBottom: '0.5rem', background: 'var(--bg-surface)' }}>
                        <div className="comment-header">
                          {reply.author?.profilePic && (
                            <img 
                              src={`http://localhost:5000/uploads/${reply.author.profilePic}`}
                              alt={reply.author.name}
                              className="author-avatar"
                              style={{ width: '24px', height: '24px' }}
                            />
                          )}
                          <span className="comment-author" style={{ fontSize: '0.85rem' }}>
                            {reply.author?.name}
                            {reply.author?.role === 'admin' && (
                              <span style={{ color: 'var(--accent)', marginLeft: '0.5rem', fontSize: '0.7rem' }}>(Admin)</span>
                            )}
                            {post?.author?._id === reply.author?._id && (
                              <span style={{ color: 'var(--radiant)', marginLeft: '0.5rem', fontSize: '0.7rem' }}>(Author)</span>
                            )}
                          </span>
                          <span className="comment-date" style={{ fontSize: '0.7rem' }}>
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                          {(user?._id === reply.author?._id || user?.role === 'admin' || user?._id === post?.author?._id) && (
                            <button 
                              onClick={() => deleteReply(comment._id, reply._id)}
                              style={{ marginLeft: 'auto', padding: '0.1rem 0.4rem', fontSize: '0.6rem', background: 'var(--danger)' }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <div className="comment-body" style={{ fontSize: '0.9rem' }}>
                          <p>{reply.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostPage;