var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var ReviewSchema = mongoose.Schema({
    author: {type: mongoose.Schema.ObjectId, ref: 'User'},
    service: {type: mongoose.Schema.ObjectId, ref: 'Service'},
    rating: {type: Number, min: 1, max: 5},
    created: {type: Date, default: Date.now},
    text: String,
});

var NotificationSchema = mongoose.Schema({
    headline: String,
    description: String,
    action: String,
    created: {type: Date, default: Date.now},
    read: Boolean
});

var UserSchema =  mongoose.Schema({
    name : String,
    email: {type:String, index:{unique: true}},
    //Don't return the user password by default.
    password: {type: String, select: false},
    description: String,
    picture_url: String,
    fb_id: String,
    fb_url: String,
    reviews: [ReviewSchema],
    notifications: [NotificationSchema]
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
module.exports.passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;