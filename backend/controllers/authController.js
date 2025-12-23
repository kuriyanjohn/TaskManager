const User = require('../models/Users');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    console.log('register');
    
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }
  
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'User already exists' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    await User.create({
      username,
      email,
      password: hashedPassword
    });
  
    res.status(201).json({ message: 'Registration successful' });
  };

  const login=async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  };

  module.exports={
    register,
    login
  }
  