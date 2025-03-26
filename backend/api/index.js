import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
//importing routes
import { authRouter } from '../routes/auth.js'

const app = express();
//injecting environment variables
dotenv.config();
connectDB()

//express body parser
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({ 'Message': 'Server is running' });
});

app.use('/v1/auth', authRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});