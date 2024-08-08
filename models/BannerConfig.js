const mongoose = require('mongoose');

const bannerConfigSchema = new mongoose.Schema({
    id:Number,
    title: String,
    content: String,
    imgURL: String
});

module.exports = mongoose.model('BannerConfig', bannerConfigSchema);
