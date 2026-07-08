// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
// };

// // @POST /api/auth/register
// const register = async (req, res) => {
//   const { name, phone, email, password } = req.body;
//   const exists = await User.findOne({ phone });
//   if (exists) return res.status(400).json({ message: 'Phone already registered' });

//   const user = await User.create({ name, phone, email, password });
//   res.status(201).json({
//     _id: user._id,
//     name: user.name,
//     phone: user.phone,
//     role: user.role,
//     token: generateToken(user._id),
//   });
// };

// // @POST /api/auth/login
// const login = async (req, res) => {
//   const { phone, password } = req.body;
//   const user = await User.findOne({ phone });
//   if (!user || !(await user.matchPassword(password))) {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }
//   res.json({
//     _id: user._id,
//     name: user.name,
//     phone: user.phone,
//     role: user.role,
//     token: generateToken(user._id),
//   });
// };

// // @GET /api/auth/me
// const getMe = async (req, res) => {
//   res.json(req.user);
// };

// module.exports = { register, login, getMe };


const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// @POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (await User.findOne({ phone }))
      return res.status(400).json({ message: 'Phone number already registered' });
    if (email && await User.findOne({ email: email.toLowerCase() }))
      return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({
      name, phone,
      email: email ? email.toLowerCase() : undefined,
      password,
    });
    res.status(201).json({
      _id: user._id, name: user.name, phone: user.phone,
      email: user.email, role: user.role, token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/auth/login — accepts phone OR email
const login = async (req, res) => {
  try {
    const { phoneOrEmail, password } = req.body;
    if (!phoneOrEmail) return res.status(400).json({ message: 'Enter your phone number or email' });

    // ✅ Search by phone first, then by email
    const user = await User.findOne({
      $or: [
        { phone: phoneOrEmail.trim() },
        { email: phoneOrEmail.trim().toLowerCase() },
      ],
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id, name: user.name, phone: user.phone,
      email: user.email, role: user.role, token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/auth/me
const getMe = async (req, res) => res.json(req.user);

// @POST /api/auth/forgot-password — user enters their email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Enter your registered email address' });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ message: 'No account found with this email address' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: '🔐 Password Reset OTP — Zorko',
      html: `
        <div style="font-family:sans-serif;max-width:420px;margin:auto;padding:28px;border-radius:14px;border:1px solid #ddd;">
          <h2 style="color:#7C3AED;text-align:center;margin-top:0;">Password Reset</h2>
          <p style="color:#555;">Hi <strong>${user.name}</strong>, here is your OTP:</p>
          <div style="text-align:center;margin:24px 0;">
            <span style="font-size:40px;font-weight:bold;letter-spacing:14px;color:#7C3AED;">${otp}</span>
          </div>
          <p style="color:#888;font-size:13px;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
          <p style="color:#aaa;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: `OTP sent to ${email.replace(/(.{2}).+(@.+)/, '$1***$2')}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/auth/verify-otp — verifies OTP and resets password
const verifyOtpAndReset = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.resetOtp || user.resetOtp !== otp.trim())
      return res.status(400).json({ message: 'Invalid OTP' });
    if (new Date() > user.resetOtpExpiry)
      return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully! You can now login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe, forgotPassword, verifyOtpAndReset };

