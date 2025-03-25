//server
const express = require('express');
const app = express();

//injecting environment variables
require("dotenv").config();

//importing routes
const authRouter = require('../routes/auth.js');

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.use('/api/v1/auth', authRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});