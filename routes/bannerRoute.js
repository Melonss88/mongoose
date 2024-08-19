const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

// 添加 Banner 配置的路由
// router.post('/banner', bannerController.addBannerConfig);
// bannerController.addBannerConfig()

// 获取 Banner 配置的路由
router.get('/banner/config', bannerController.getBannerConfig);

module.exports = router;