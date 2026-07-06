// const MenuItem = require('../models/MenuItem');
// const Category = require('../models/Category');
// const Order = require('../models/Order');

// // ── MENU ITEMS ──────────────────────────────────────

// // @GET /api/admin/items
// const getAllItems = async (req, res) => {
//   const items = await MenuItem.find().populate('category').sort('-createdAt');
//   res.json(items);
// };

// // @POST /api/admin/items
// const createItem = async (req, res) => {
//   const { name, description, category, basePrice, variants, addOns, isVeg, tags } = req.body;
//   const image = req.file ? req.file.path : '';

//   const item = await MenuItem.create({
//     name, description, category, basePrice,
//     variants: variants ? JSON.parse(variants) : [],
//     addOns: addOns ? JSON.parse(addOns) : [],
//     isVeg: isVeg === 'true',
//     tags: tags ? JSON.parse(tags) : [],
//     image,
//   });
//   res.status(201).json(item);
// };

// // @PUT /api/admin/items/:id
// const updateItem = async (req, res) => {
//   const item = await MenuItem.findById(req.params.id);
//   if (!item) return res.status(404).json({ message: 'Not found' });

//   const { name, description, category, basePrice, variants, addOns, isVeg, isAvailable, tags } = req.body;

//   item.name = name || item.name;
//   item.description = description ?? item.description;
//   item.category = category || item.category;
//   item.basePrice = basePrice || item.basePrice;
//   item.variants = variants ? JSON.parse(variants) : item.variants;
//   item.addOns = addOns ? JSON.parse(addOns) : item.addOns;
//   item.isVeg = isVeg !== undefined ? isVeg === 'true' : item.isVeg;
//   item.isAvailable = isAvailable !== undefined ? isAvailable === 'true' : item.isAvailable;
//   item.tags = tags ? JSON.parse(tags) : item.tags;
//   if (req.file) item.image = req.file.path;

//   await item.save();
//   res.json(item);
// };

// // @DELETE /api/admin/items/:id
// const deleteItem = async (req, res) => {
//   await MenuItem.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Deleted' });
// };

// // ── CATEGORIES ──────────────────────────────────────

// // @GET /api/admin/categories
// const getCategories = async (req, res) => {
//   res.json(await Category.find().sort('order'));
// };

// // @POST /api/admin/categories
// const createCategory = async (req, res) => {
//   const { name, icon, order } = req.body;
//   const slug = name.toLowerCase().replace(/\s+/g, '-');
//   const image = req.file ? req.file.path : ''; // NEW
//   const cat = await Category.create({ name, slug, icon, order, image });
//   res.status(201).json(cat);
// };

// // @DELETE /api/admin/categories/:id
// const deleteCategory = async (req, res) => {
//   await Category.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Deleted' });
// };

// // ── ORDERS ──────────────────────────────────────────

// // @GET /api/admin/orders
// const getAllOrders = async (req, res) => {
//   const { status, page = 1, limit = 20 } = req.query;
//   const filter = status ? { orderStatus: status } : {};
//   const orders = await Order.find(filter)
//     .sort('-createdAt')
//     .skip((page - 1) * limit)
//     .limit(Number(limit));
//   const total = await Order.countDocuments(filter);
//   res.json({ orders, total, page, pages: Math.ceil(total / limit) });
// };

// // @PUT /api/admin/orders/:id/status
// const updateOrderStatus = async (req, res) => {
//   const { orderStatus, paymentStatus } = req.body;
//   const order = await Order.findById(req.params.id);
//   if (!order) return res.status(404).json({ message: 'Not found' });
//   if (orderStatus) order.orderStatus = orderStatus;
//   if (paymentStatus) order.paymentStatus = paymentStatus;
//   await order.save();
//   res.json(order);
// };

// module.exports = {
//   getAllItems, createItem, updateItem, deleteItem,
//   getCategories, createCategory, deleteCategory,
//   getAllOrders, updateOrderStatus,
// };




const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');
const { updateSettings } = require('./settingsController');

// ── MENU ITEMS ──────────────────────────────────────

const getAllItems = async (req, res) => {
  const items = await MenuItem.find().populate('category').sort('-createdAt');
  res.json(items);
};

const createItem = async (req, res) => {
  const { name, description, category, basePrice, variants, addOns, isVeg, tags } = req.body;
  const image = req.file ? req.file.path : '';
  const item = await MenuItem.create({
    name, description, category, basePrice,
    variants: variants ? JSON.parse(variants) : [],
    addOns: addOns ? JSON.parse(addOns) : [],
    isVeg: isVeg === 'true',
    tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    image,
  });
  res.status(201).json(item);
};

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
  item.tags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : item.tags;
  if (req.file) item.image = req.file.path;
  await item.save();
  res.json(item);
};

const deleteItem = async (req, res) => {
  await MenuItem.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

// ── CATEGORIES ──────────────────────────────────────

const getCategories = async (req, res) => {
  res.json(await Category.find().sort('order'));
};

const createCategory = async (req, res) => {
  const { name, icon, order } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const image = req.file ? req.file.path : '';
  const cat = await Category.create({ name, slug, icon, order, image });
  res.status(201).json(cat);
};

const deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

// ── ORDERS ──────────────────────────────────────────

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

const updateOrderStatus = async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  await order.save();
  res.json(order);
};

// ── STATS ✅ NEW ─────────────────────────────────────

const getStats = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart); weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(todayStart); monthStart.setDate(monthStart.getDate() - 30);

    const notCancelled = { orderStatus: { $ne: 'cancelled' } };

    const [todayOrders, weekOrders, monthOrders] = await Promise.all([
      Order.find({ createdAt: { $gte: todayStart }, ...notCancelled }),
      Order.find({ createdAt: { $gte: weekStart }, ...notCancelled }),
      Order.find({ createdAt: { $gte: monthStart }, ...notCancelled }),
    ]);

    // Last 7 days chart
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(todayStart);
      dayStart.setDate(dayStart.getDate() - i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      const dayOrders = weekOrders.filter(o =>
        new Date(o.createdAt) >= dayStart && new Date(o.createdAt) < dayEnd
      );
      last7Days.push({
        date: dayStart.toLocaleDateString('en-IN', { weekday: 'short' }),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((s, o) => s + o.totalAmount, 0),
      });
    }

    // Top items this month
    const itemCounts = {};
    monthOrders.forEach(order => {
      order.items.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      });
    });
    const topItems = Object.entries(itemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json({
      today: { orders: todayOrders.length, revenue: todayOrders.reduce((s, o) => s + o.totalAmount, 0) },
      week: { orders: weekOrders.length, revenue: weekOrders.reduce((s, o) => s + o.totalAmount, 0) },
      month: { orders: monthOrders.length, revenue: monthOrders.reduce((s, o) => s + o.totalAmount, 0) },
      last7Days,
      topItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── REVIEWS MODERATION ✅ NEW ─────────────────────────

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('menuItem', 'name image')
      .populate('user', 'name')
      .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Not found' });
    const itemId = review.menuItem;
    await Review.findByIdAndDelete(req.params.id);
    // Recalculate rating
    const remaining = await Review.find({ menuItem: itemId });
    if (remaining.length > 0) {
      const avg = remaining.reduce((s, r) => s + r.rating, 0) / remaining.length;
      await MenuItem.findByIdAndUpdate(itemId, { averageRating: Number(avg.toFixed(1)), numReviews: remaining.length });
    } else {
      await MenuItem.findByIdAndUpdate(itemId, { averageRating: 0, numReviews: 0 });
    }
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetItemRatings = async (req, res) => {
  try {
    await Review.deleteMany({ menuItem: req.params.itemId });
    await MenuItem.findByIdAndUpdate(req.params.itemId, { averageRating: 0, numReviews: 0 });
    res.json({ message: 'Ratings reset' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── COUPONS ✅ NEW ────────────────────────────────────

const getCoupons = async (req, res) => {
  try {
    res.json(await Coupon.find().sort('-createdAt'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt } = req.body;
    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxUses: maxUses ? Number(maxUses) : null,
      expiresAt: expiresAt || null,
    });
    res.status(201).json(coupon);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Coupon code already exists' });
    res.status(500).json({ message: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllItems, createItem, updateItem, deleteItem,
  getCategories, createCategory, deleteCategory,
  getAllOrders, updateOrderStatus,
  getStats,
  getAllReviews, deleteReview, resetItemRatings,
  getCoupons, createCoupon, deleteCoupon,
  updateSettings,
};