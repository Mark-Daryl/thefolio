export const getImageUrl = (filename) => {
  if (!filename) return '/default-avatar.png';
  const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${baseUrl}/uploads/${filename}`;
};