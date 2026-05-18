const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const Order = require('../models/Order');

// ── MENU ITEMS ──────────────────────────────────────

// @GET /api/admin/items
const getAllItems = async (req, res) => {
  const items = await MenuItem.find().populate('category').sort('-createdAt');
  res.json(items);
};

// @POST /api/admin/items
const createItem = async (req, res) => {
  const { name, description, category, basePrice, variants, addOns, isVeg, tags } = req.body;
  const image = req.file ? req.file.path : '';

  const item = await MenuItem.create({
    name, description, category, basePrice,
    variants: variants ? JSON.parse(variants) : [],
    addOns: addOns ? JSON.parse(addOns) : [],
    isVeg: isVeg === 'true',
    tags: tags ? JSON.parse(tags) : [],
    image,
  });
  res.status(201).json(item);
};

// @PUT /api/admin/items/:id
const updateItem = async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });

  const { name, description, category, basePrice, variants, addOns, isVeg, isAvailable, tags } = req.body;

  item.name = name || item.name;
  item.description = description ?? item.description;
  item.category = category || item.category;
  item.basePrice = basePrice || item.basePrice;
  item.variants = variants ? JSON.parse(variants) : item.variants;
  item.addOns = addOns ? JSON.parse(addOns) : item.addOns;
  item.isVeg = isVeg !== undefined ? isVeg === 'true' : item.isVeg;
  item.isAvailable = isAvailable !== undefined ? isAvailable === 'true' : item.isAvailable;
  item.tags = tags ? JSON.parse(tags) : item.tags;
  if (req.file) item.image = req.file.path;

  await item.save();
  res.json(item);
};

// @DELETE /api/admin/items/:id
const deleteItem = async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

// ── CATEGORIES ──────────────────────────────────────

// @GET /api/admin/categories
const getCategories = async (req, res) => {
  res.json(await Category.find().sort('order'));
};

// @POST /api/admin/categories
const createCategory = async (req, res) => {
  const { name, icon, order } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const image = req.file ? req.file.path : ''; // NEW
  const cat = await Category.create({ name, slug, icon, order, image });
  res.status(201).json(cat);
};

// @DELETE /api/admin/categories/:id
const deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

// ── ORDERS ──────────────────────────────────────────

// @GET /api/admin/orders
const getAllOrders = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = status ? { orderStatus: status } : {};
  const orders = await Order.find(filter)
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await Order.countDocuments(filter);
  res.json({ orders, total, page, pages: Math.ceil(total / limit) });
};

// @PUT /api/admin/orders/:id/status
const updateOrderStatus = async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  await order.save();
  res.json(order);
};

module.exports = {
  getAllItems, createItem, updateItem, deleteItem,
  getCategories, createCategory, deleteCategory,
  getAllOrders, updateOrderStatus,
};