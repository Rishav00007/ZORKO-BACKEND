const Settings = require('../models/Settings');

// Helper to get or create settings (always 1 document)
const getOrCreate = async () => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({ isOpen: true, estimatedDeliveryTime: '30-45 mins' });
  return settings;
};

// @GET /api/settings — public
const getSettings = async (req, res) => {
  try {
    res.json(await getOrCreate());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/admin/settings — admin only
const updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreate();
    const { isOpen, estimatedDeliveryTime } = req.body;
    if (isOpen !== undefined) settings.isOpen = isOpen;
    if (estimatedDeliveryTime) settings.estimatedDeliveryTime = estimatedDeliveryTime;
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSettings };