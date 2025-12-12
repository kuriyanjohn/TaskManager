require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(process.env.PORT || 5000, () => console.log('Server running'));
};
start();
