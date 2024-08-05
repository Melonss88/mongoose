const mongoose = require('mongoose');

const mintSchema = new mongoose.Schema({
  to: { type: String, required: true },
  tokenId: { type: Number, required: true },
  uri: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Mint', mintSchema);
