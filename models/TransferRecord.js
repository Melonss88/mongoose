const mongoose = require('mongoose');

const transferRecordSchema = new mongoose.Schema({
  from: String,
  to: String,
  tokenId: Number,
  timestamp: Date,
});

module.exports = mongoose.model('TransferRecord', transferRecordSchema);
