require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://10.139.141.42:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());  
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('mongobd connected'); 
  app.listen(process.env.PORT,() => console.log(`Server running on ${process.env.PORT}`));
};
start();