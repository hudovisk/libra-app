var User = require('./user-model');

var passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

module.exports.getAll = function(req, res, next) {
    User.find()
        .exec(function(err, users) {
            if(err) return next(err);

            res.status(200).json({users: users});
        });
};

module.exports.getMe = function(req, res, next) {
    User.findById(req.user._id, function(err, user) {
        if(err) return next(err);

        res.status(200).json({user: user});
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
            res.status(201).json({user: userAux});
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
            res.status(200).json({user: userAux});
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
        .exec(function(err, user) {
            if(err) return next(err);
            return res.status(200).json({reviews: user.reviews});
        });
};  

module.exports.pushReview = function(req, res, next) {
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
            "reviews.author._id": req.user._id,
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
