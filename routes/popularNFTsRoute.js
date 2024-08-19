const express = require('express');
const router = express.Router();
const popularNFTsController = require('../controllers/popularNFTsController');

// 配置
// popularNFTsController.addPopularNFTs()

// 获取
router.get('/popular/nfts', popularNFTsController.getPopularNFTs);

module.exports = router;