
var LocalStrategy = require('passport-local').Strategy;

var User = require('./../api/users/user-model')

module.exports = function(passport) {
    
    var passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(userId, done) {
        User.findById(userId, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signin', new LocalStrategy( {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },

        function(req, email, password, done) {
            User.findOne({email: email})
                .select('+password')
                .exec(function(err, user) {
                    if(err) { 
                        return done(err); 
                    }
                    if(!user) {
                        return done(null, false, {status: 401, message: 'Incorrect email/password.'});
                    }
                    if(!user.comparePassword(password)) {
                        return done(null, false, {status: 401, message: 'Incorrect email/password.'});
                    }
                    return done(null, user);
            });
        }
    ));

    passport.use('local-signup', new LocalStrategy( {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },

        function(req, email, password, done) {
            //Note(Hudo):Only validate password in test and production enviroments to facilitate use.
            if (process.env.NODE_ENV === 'production' || 
                    process.env.NODE_ENV === 'test') {
                if(!passwordRegex.test(req.body.password)) {
                    return done(null, false, {status: 400, message: 'Invalid password.'});
                }
            }     

            var user = new User( {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            user.save(function(err) {
                if(err) {
                    if(err.code == 11000) {
                        return done(null, false, {status: 409, message: 'Email already registered.'});
                    }
                    return done(err);
                }

                return done(null, user);
            });
               
        }));
};