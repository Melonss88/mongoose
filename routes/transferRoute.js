const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const { contract } = require('../config/contractConfig');

transferController.initializeContract(contract);

router.get('/transfer/records', transferController.getTransferRecords);

module.exports = router;

