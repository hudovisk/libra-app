var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var ReviewSchema = mongoose.Schema({
    author: {type: mongoose.Schema.ObjectId, ref: 'User'},
    service: {type: mongoose.Schema.ObjectId, ref: 'Service'},
    rating: {type: Number, min: 1, max: 5},
    created: {type: Date, default: Date.now},
    text: String,
});

var UserSchema =  mongoose.Schema({
    name : String,
    email: {type:String, index:{unique: true}},
    //Don't return the user password by default.
    password: {type: String, select: false},
    reviews: [ReviewSchema]
});

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);