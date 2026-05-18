const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

// @GET /api/menu
const getMenu = async (req, res) => {
  const categories = await Category.find().sort('order');
  const items = await MenuItem.find({ isAvailable: true }).populate('category');
  
  // Group items by category
  const menuByCategory = categories.map(cat => ({
    category: cat,
    items: items.filter(item => item.category._id.toString() === cat._id.toString())
  }));

  res.json(menuByCategory);
};

// @GET /api/menu/items/:id
const getMenuItem = async (req, res) => {
  const item = await MenuItem.findById(req.params.id).populate('category');
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
};

module.exports = { getMenu, getMenuItem };