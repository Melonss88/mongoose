const mongoose = require('mongoose');

const transactionRecordSchema = new mongoose.Schema({
  from: String,
  to: String,
  value: String,
  transactionHash: String,
  timestamp: Date,
});

module.exports = mongoose.model('TransactionRecord', transactionRecordSchema);
