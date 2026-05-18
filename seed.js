// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const admin = await User.create({
    name: 'Zorko',
    phone: '9835286591',
    password: 'Varun@142',
    role: 'admin',
  });
  console.log('Admin created:', admin.phone);
  process.exit();
});