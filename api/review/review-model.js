var mongoose = require('mongoose');

var ReviewSchema = mongoose.Schema({
    author: {type: mongoose.Schema.ObjectId, ref: 'User'},
    service: {type: mongoose.Schema.ObjectId, ref: 'Service'}
    rating: {type: Number, min: 1, max: 5},
    created: {type: Date, default: Date.now},
    text: String,
});

module.exports = mongoose.model('Review', ReviewSchema);