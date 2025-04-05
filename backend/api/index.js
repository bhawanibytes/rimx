import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import cors from 'cors';
import authRouter from '../routes/auth.js'; // Assuming this exists
import organizationRouter from '../routes/organizations.js'; // Import the updated organization router
import auth from '../middlewares/auth.js'; // Import the auth middleware
import joinRequests from '../routes/joinRequests.js';
import inviteRouter from '../routes/invitations.js'; // Import the invitation router
import membersRouter from '../routes/membersRoutes.js'; // Import the members routes

const app = express();

// Inject environment variables
dotenv.config();
connectDB();

const corsOption = {
  origin: process.env.CORS_FRONTEND,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200
};

app.use(cors(corsOption));

// Express body parser
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.status(200).json({ 'Message': 'Server is running' });
});

// Auth routes
app.use('/v1/auth', authRouter);

// Organization routes (without auth middleware)
app.use('/v1/org/organizations',auth, organizationRouter);
app.use('/v1/org/organizations', auth, inviteRouter);
app.use('/v1/invitations',auth,inviteRouter);
app.use('/v1/org/user',auth, inviteRouter);

app.use('/v1/org/organizations',auth, joinRequests);
app.use('/v1/org/organizations',auth, membersRouter); // Add members routes

// Error handling middleware (should be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Server error',
    message: err.message 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;