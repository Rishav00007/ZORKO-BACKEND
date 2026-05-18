const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for menu item images
const menuStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'food-outlet/menu',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

// Storage for payment screenshots
const paymentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'food-outlet/payments',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const uploadMenu = multer({ storage: menuStorage });
const uploadPayment = multer({ storage: paymentStorage });

module.exports = { cloudinary, uploadMenu, uploadPayment };