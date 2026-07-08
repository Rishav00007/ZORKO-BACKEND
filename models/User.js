// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   phone: { type: String, required: true, unique: true },
//   email: { type: String },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
//   addresses: [{ 
//     label: String, 
//     fullAddress: String, 
//     landmark: String 
//   }]
// }, { timestamps: true });

// userSchema.pre('save', async function () {
//   if (!this.isModified('password')) return;
//   this.password = await bcrypt.hash(this.password, 10);
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  addresses: [{ 
    label: String, 
    fullAddress: String, 
    landmark: String 
  }],
  resetOtp: { type: String },          
  resetOtpExpiry: { type: Date }    
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
