import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import cors from 'cors'
//importing routes
import { authRouter } from '../routes/auth.js'

const app = express();
//injecting environment variables
dotenv.config();
connectDB()
const corsOption ={
  origin: process.env.CORS_FRONTEND,
  optionSuccessStatus: 200
}

app.use(cors(corsOption))

//express body parser
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({ 'Message': 'Server is running' });
});

app.use('/v1/auth', authRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});