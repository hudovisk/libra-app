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
    console.log("pushReview");
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
        function(err) {
            console.log(err);
            if(err) return next(err);
            return res.status(201).end();
        });
};

module.exports.updateReview = function(req, res, next) {
    User.update(
        {
            _id: req.params.user_id,
            "reviews._id": req.params.review_id
        },
        {
            $set: {
                "reviews.$.rating": req.body.rating,
                "reviews.$.text": req.body.text
            }
        },
        function(err) {
            if(err) return next(err);
            return res.status(200).end();
        });
};

module.exports.deleteReview = function(req, res, next) {
    User.update(
        {
            _id: req.params.user_id
        },
        {
            $pull: {
                reviews: { 
                    _id: req.params.review_id 
                } 
            }
        },
        function(err) {
            if(err) return next(err);
            return res.status(200).end();
        });
};
