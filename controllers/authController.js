const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @POST /api/auth/register
const register = async (req, res) => {
  const { name, phone, email, password } = req.body;
  const exists = await User.findOne({ phone });
  if (exists) return res.status(400).json({ message: 'Phone already registered' });

  const user = await User.create({ name, phone, email, password });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    phone: user.phone,
    role: user.role,
    token: generateToken(user._id),
  });
};

// @POST /api/auth/login
const login = async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({
    _id: user._id,
    name: user.name,
    phone: user.phone,
    role: user.role,
    token: generateToken(user._id),
  });
};

// @GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, getMe };