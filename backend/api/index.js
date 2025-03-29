import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import auth from '../middlewares/auth.js';
import Organization from '../models/Organization.js';
import User from '../models/userModel.js';
import authRoutes from '../routes/auth.js';
import organizationRoutes from '../routes/organizations.js';
// import invitationRoutes from '../routes/invitations.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/org-manager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
// app.use('/api/invitations', invitationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Protected test route
app.get('/api/protected', auth, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app; // For testing