require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contact.routes');
const passwordRoutes = require('./routes/password.routes');

const app = express();
connectDB();

// Middleware
app.use(cors({ origin: ['http://localhost:3000', 'https://frontend-psi-olive-56.vercel.app'], credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes (will add later)
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/posts', require('./routes/post.routes'));
app.use('/api/comments', require('./routes/comment.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/contact', contactRoutes);
app.use('/api/password', passwordRoutes);

// This is the CORRECT way for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));