const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const header = req.header('Authorization');
  if (!header) return res.status(401).json({ message: 'No token' });
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, username, ... }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
