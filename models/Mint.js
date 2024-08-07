const mongoose = require('mongoose');

const mintSchema = new mongoose.Schema({
  to: { type: String, required: true },
  tokenId: { type: Number, required: true },
  uri: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  name: { type: String, required: true },
  imageURL:{ type: String, required: true },
  color: { type: String, required: true },
  gender: { type: String, required: true },
  rarity: { type: String, required: true },
  price: { type: Number, required: true },
  accessories: { type: String, required: true },
});

module.exports = mongoose.model('Mint', mintSchema);
