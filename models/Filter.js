const mongoose = require('mongoose');

const filterConfigSchema = new mongoose.Schema({
    name:String,
    items:Array
});

module.exports = mongoose.model('filterConfig', filterConfigSchema);
