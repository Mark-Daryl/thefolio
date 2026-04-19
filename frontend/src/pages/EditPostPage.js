// src/pages/EditPostPage.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const EditPostPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        // Check authorization
        if (String(data.author._id) !== String(user?._id) && user?.role !== 'admin') {
          navigate('/');
          return;
        }
        setTitle(data.title);
        setBody(data.body);
        setExistingImage(data.image);
        setLoading(false);
      } catch (err) {
        setError('Post not found');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) fd.append('image', image);
    
    try {
      await API.put(`/posts/${id}`, fd);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading post</div>;
  if (error) return <div className="error-msg text-center">{error}</div>;

  return (
    <div className="container">
      <div className="edit-post-page">
        <h2 className="text-center">✏️ Edit Post</h2>
        
        {error && <div className="error-msg">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <label>Post Title</label>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="Post title"
            required 
          />
          
          <label>Content</label>
          <textarea 
            value={body} 
            onChange={e => setBody(e.target.value)} 
            placeholder="Write your post here..."
            rows={12} 
            required 
          />
          
          {user?.role === 'admin' && (
            <div>
              <label>📷 Update Cover Image (Optional)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
              />
              {(imagePreview || existingImage) && (
                <div className="image-preview">
                  <img 
                    src={imagePreview || `http://localhost:5000/uploads/${existingImage}`} 
                    alt="Preview" 
                  />
                </div>
              )}
            </div>
          )}
          
          <div className="flex" style={{ gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : '💾 Save Changes'}
            </button>
            <button type="button" onClick={() => navigate(`/posts/${id}`)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;