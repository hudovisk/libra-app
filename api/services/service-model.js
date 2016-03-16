var mongoose = require('mongoose');

var ServiceSchema =  mongoose.Schema({
    employer: {type: mongoose.Schema.ObjectId, ref: 'User'},
    employee: {type: mongoose.Schema.ObjectId, ref: 'User'},
    biddings: [{type: mongoose.Schema.ObjectId, ref: 'bid'}],
    headline: String,
    description: String,
    minRange: Number,
    maxRange: Number,
    tags: [{type: String}]
});

module.exports = mongoose.model('Service', ServiceSchema);