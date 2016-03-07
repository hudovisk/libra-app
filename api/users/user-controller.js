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
    console.log("before passport");
    passport.authenticate('local-signin', function (err, user, info) {
        console.log("Login user controller");
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
