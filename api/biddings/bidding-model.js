var mongoose = require('mongoose');

var BiddingSchema =  mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    explanation: String,
    value: Number,
    counterValue: Number,
    date: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Bidding', BiddingSchema);