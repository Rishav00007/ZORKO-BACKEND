// const Settings = require('../models/Settings');

// // Helper to get or create settings (always 1 document)
// const getOrCreate = async () => {
//   let settings = await Settings.findOne();
//   if (!settings) settings = await Settings.create({ isOpen: true, estimatedDeliveryTime: '30-45 mins' });
//   return settings;
// };

// // @GET /api/settings — public
// const getSettings = async (req, res) => {
//   try {
//     res.json(await getOrCreate());
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @PUT /api/admin/settings — admin only
// const updateSettings = async (req, res) => {
//   try {
//     const settings = await getOrCreate();
//     const { isOpen, estimatedDeliveryTime } = req.body;
//     if (isOpen !== undefined) settings.isOpen = isOpen;
//     if (estimatedDeliveryTime) settings.estimatedDeliveryTime = estimatedDeliveryTime;
//     await settings.save();
//     res.json(settings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { getSettings, updateSettings };



// const Settings = require('../models/Settings');

// // Helper to get or create settings (always 1 document)
// const getOrCreate = async () => {
//   let settings = await Settings.findOne();
//   if (!settings) settings = await Settings.create({ isOpen: true, estimatedDeliveryTime: '30-45 mins' });
//   return settings;
// };

// // @GET /api/settings — public
// const getSettings = async (req, res) => {
//   try {
//     res.json(await getOrCreate());
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @PUT /api/admin/settings — admin only
// const updateSettings = async (req, res) => {
//   try {
//     const settings = await getOrCreate();
//     const { isOpen, estimatedDeliveryTime } = req.body;
//     if (isOpen !== undefined) settings.isOpen = isOpen;
//     if (estimatedDeliveryTime) settings.estimatedDeliveryTime = estimatedDeliveryTime;
//     await settings.save();
//     res.json(settings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { getSettings, updateSettings };



const Settings = require('../models/Settings');

const getOrCreate = async () => {
  let s = await Settings.findOne();
  if (!s) s = await Settings.create({
    isOpen: true,
    estimatedDeliveryTime: '30-45 mins',
    heroBanner: {
      title: '🍴 Welcome!',
      subtitle: 'Fresh food, delivered to your door',
      badge: 'Enjoy Free Delivery on Orders above ₹200 🎉',
      bgColor1: '#7C3AED',
      bgColor2: '#a855f7',
      imageUrl: '',
    },
  });
  return s;
};

const getSettings = async (req, res) => {
  try {
    res.json(await getOrCreate());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const s = await getOrCreate();
    const { isOpen, estimatedDeliveryTime, heroBanner } = req.body;
    if (isOpen !== undefined) s.isOpen = isOpen;
    if (estimatedDeliveryTime) s.estimatedDeliveryTime = estimatedDeliveryTime;
    if (heroBanner) {
      // Merge heroBanner fields individually to avoid wiping unset fields
      const existing = s.heroBanner?.toObject ? s.heroBanner.toObject() : (s.heroBanner || {});
      s.heroBanner = { ...existing, ...heroBanner };
    }
    await s.save();
    res.json(s);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSettings };