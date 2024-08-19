const express = require('express');
const router = express.Router();
const mintController = require('../controllers/mintController');
const { contract } = require('../config/contractConfig');

mintController.initializeContract(contract);

router.post('/mint/records', mintController.getMintRecords);

module.exports = router;
