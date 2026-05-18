const express = require('express');
const router = express.Router();
const { getMenu, getMenuItem } = require('../controllers/menuController');

router.get('/', getMenu);
router.get('/items/:id', getMenuItem);

module.exports = router;