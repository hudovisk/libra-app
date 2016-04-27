var User = require('./user-model');
var Service = require('../services/service-model');

module.exports.getAll = function(req, res, next) {
    User.find()
        .exec(function(err, users) {
            if(err) return next(err);

            return res.status(200).json(users);
        });
};

module.exports.getMe = function(req, res, next) {
    User.findById(req.user._id, function(err, user) {
        if(err) return next(err);

        return res.status(200).json(user);
    });
};

module.exports.updateUser = function(req, res, next) {
    delete req.body.password;
    User.update(
        {
            _id: req.user._id
        },
        {
            $set: req.body
        },
        function(err, user) {
            if(err) return next(err);

            return res.status(200).end();
    });
};

module.exports.disconnectFacebook = function(req, res, next) {
    User.update(
        {
            _id: req.user._id
        },
        {
            $unset: {
                fb_url: "",
                fb_id: ""
            }
        },
        function(err, user) {
            if(err) return next(err);

            return res.redirect('/settings');
    });
};

module.exports.updatePassword = function(req, res, next) {
    User.findById(req.user._id)
        .select('+password')
        .exec(function(err, user) {
        if(err) return next(err);

        if(!user.comparePassword(req.body.password)) {
            return res.status(400).json({message: "Current password doesn't match"});
        }
        if(!User.passwordRegex.test(req.body.newPassword)) {
            return res.status(400).json({message: 'Invalid new password format.'});
        }
        
        user.password = req.body.newPassword;
        user.save(function(err) {
            if(err) next(err);

            return res.status(200).end();
        });
    });
};

module.exports.getUser = function(req, res, next) {
    User.findById(req.params.user_id, function(err, user) {
        if(err) return next(err);

        return res.status(200).json(user);
    });
};

module.exports.register = function(passport, req, res, next) {
    passport.authenticate('local-signup', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { 
            res.status(info.status).json({message: info.message});
            return;
        }

        req.login(user, function (err) {
            if(err){
                return next(err);
            }

            //never send password
            var userAux = user.toObject();

            delete userAux.password;
            return res.status(201).json(userAux);
        });
    })(req, res, next);
};

module.exports.login = function(passport, req, res, next) {
    passport.authenticate('local-signin', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { 
            res.status(info.status).json({message: info.message});
            return;
        }

        req.login(user, function (err) {
            if(err){
                return next(err);
            }

            //never send password
            var userAux = user.toObject();
            delete userAux.password;
            return res.status(200).json(userAux);
        });
    })(req, res, next);
};

module.exports.logout = function(req, res, next) {
    req.logout();        
    res.status(200).json({message: 'User logout.'});
};

module.exports.getAllReviews = function(req, res, next) {
    User.findById(req.params.user_id)
        .populate('reviews')
        .populate('reviews.author')
        .populate('reviews.service')
        .exec(function(err, user) {
            if(err) return next(err);
            return res.status(200).json(user.reviews);
        });
};  

module.exports.pushReview = function(req, res, next) {
    console.log(req.body);
    Service.findById(req.body.service, function(err, service) {
        if(err) return next(err);
        if(!service) return res.status(400).send('Service not found.');
        if(String(service.employer) !== String(req.user._id) &&
                String(service.employee) !== String(req.user._id)) {
            return res.status(403).end(); // if author is not related to the service
        }
        if(String(service.employer) !== String(req.params.user_id) &&
                String(service.employee) !== String(req.params.user_id)) {
            return res.status(403).end(); // if person reviewed is not related to the service.
        }
        if(String(req.params.user_id) === String(req.user._id)) {
            return res.status(403).end(); // You should not review yourself.
        }
        
        User.update(
        {
            _id: req.params.user_id
        },
        {
            $push: {
                "reviews": {
                    "author": req.user._id,
                    "service": req.body.service,
                    "rating": req.body.rating,
                    "text": req.body.text
                }
            }
        },
        function(err, numOfAffected) {
            console.log(err);
            if(err) return next(err);
            if(numOfAffected === 0) return res.status(404).end();
            return res.status(201).end();
        });
    });
};

module.exports.updateReview = function(req, res, next) {
    User.update(
        {
            _id: req.params.user_id,
            "reviews._id": req.params.review_id,
            "reviews.author._id": req.user._id
        },
        {
            $set: {
                "reviews.$.rating": req.body.rating,
                "reviews.$.text": req.body.text
            }
        },
        function(err, numOfAffected) {
            if(err) return next(err);
            if(numOfAffected === 0) return res.status(404).end();
            return res.status(200).end();
        });
};

module.exports.deleteReview = function(req, res, next) {
    User.update(
        {
            _id: req.params.user_id,
            "reviews.author._id": req.user._id
        },
        {
            $pull: {
                reviews: { 
                    _id: req.params.review_id 
                } 
            }
        },
        function(err, numOfAffected) {
            if(err) return next(err);
            if(numOfAffected === 0) return res.status(404).end();
            return res.status(200).end();
        });
};

module.exports.pushNotification = function (userId, notification) {
    User.update(
        {
            _id: userId
        },
        {
            $push: {
                "notifications": {
                    "headline": notification.headline,
                    "description": notification.description,
                    "action": notification.action,
                    "read": notification.read
                }
            }
        },
        function(err, numOfAffected) {
            if(err) console.log(err);
            if(numOfAffected === 0) console.log("Warn - No user affected. UserId: " + userId);
            
            console.log("Notification saved!");
        });
};

module.exports.getNotifications = function(req, res, next) {
    var notifications = req.user.toObject().notifications;
    return res.status(200).json(notifications.sort(function (a, b) {
        return b.created - a.created;
    }));
};

module.exports.readNotification = function(req, res, next) {
    User.update(
        {
            _id: req.user._id,
            "notifications._id": req.params.notification_id,
        },
        {
            $set: {
                "notifications.$.read": true
            }
        },
        function(err, numOfAffected) {
            if(err) return next(err);
            if(numOfAffected === 0) return res.status(404).end();
            return res.status(200).end();
        });
};
