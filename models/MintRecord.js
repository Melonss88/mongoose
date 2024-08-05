const mongoose = require('mongoose');

const mintRecordSchema = new mongoose.Schema({
  tokenId: Number,
  to: String,
  uri: String,
  timestamp: Date,
});

module.exports = mongoose.model('MintRecord', mintRecordSchema);
