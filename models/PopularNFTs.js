const mongoose = require('mongoose');

const PopularNFTsSchema = new mongoose.Schema({
    id:String,
    name: String,
    price: String,
    imgURL: String,
    website:String
});

module.exports = mongoose.model('PopularNFTs', PopularNFTsSchema);
