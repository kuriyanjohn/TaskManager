const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

router.post('/register', [
  body('username').isLength({min:3}),
  body('email').isEmail(),
  body('password').isLength({min:6})
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: 'Email exists' });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  user = new User({ username, email, password: hashed });
  await user.save();

  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
});

router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
});

module.exports = router;
