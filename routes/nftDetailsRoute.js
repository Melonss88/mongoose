const express = require('express');
const router = express.Router();
const nftDetailsController = require('../controllers/nftDetailsController')

router.get('/nft/details/:tokenId', nftDetailsController.getNFTDetails);

module.exports = router;