var mongoose = require('mongoose');

var ServiceSchema =  mongoose.Schema({
    employer: {type: ObjectId, ref: 'user'},
    employee: {type: ObjectId, ref: 'user'},
    biddings: [{type: ObjectId, ref: 'bid'}],
    headline: String,
    description: String,
    minRange: int,
    maxRange: int,
    tags: [{type: String}]
});

module.exports = mongoose.model('Service', ServiceSchema);