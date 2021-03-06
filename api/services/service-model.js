var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var BiddingSchema =  mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User'},
    explanation: String,
    value: Number,
    counterValue: Number,
    counterExplanation: String,
    date: {type: Date, default: Date.now},
});

var ServiceSchema =  mongoose.Schema({
    employer: {type: mongoose.Schema.ObjectId, ref: 'User'},
    employer_reviewed: {type:Boolean, default: false},
    employee: {type: mongoose.Schema.ObjectId, ref: 'User'},
    employee_reviewed: {type:Boolean, default: false},
    biddings: [BiddingSchema],
    headline: String,
    description: String,
    minRange: Number,
    value: Number,
    maxRange: Number,
    totalHours: Number,
    pause: {type:Boolean, default: false},
    tags: [{type: String}],
    created: {type: Date, default: Date.now},
});

ServiceSchema.index({ 
        headline: 'text',
        description: 'text',
        tags: 'text'
    }, {
        name: 'Service index',
        weights: {
            headline: 6,
            description: 4,
            tags: 2
        }
});

ServiceSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Service', ServiceSchema);