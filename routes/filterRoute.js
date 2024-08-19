const express = require('express');
const router = express.Router();
const filterController = require('../controllers/filterController');

// 配置
// filterController.addFilterConfig()

// 获取
router.get('/filter/config', filterController.getFilterConfig);

module.exports = router;