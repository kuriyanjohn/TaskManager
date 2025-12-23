const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const { body, validationResult } = require('express-validator');
const { register, login } = require('../controllers/authController');

router.post('/register',register);
router.post('/login',login)

module.exports = router;
