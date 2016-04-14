
var LocalStrategy = require('passport-local').Strategy;

var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('./../api/users/user-model');
var randomString = require('random-string');

module.exports = function(passport) {

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
            if(!User.passwordRegex.test(req.body.password)) {
                return done(null, false, {status: 400, message: 'Invalid password.'});
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

    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: "http://localhost:1337/api/users/login/facebook/callback",
            profileFields: ['displayName', 'profileUrl', 'email', 'picture.type(large)']
        },

        function(accessToken, refreshToken, profile, done) {
            var name = profile.displayName;
            var email = profile.emails[0].value;
            var picture_url = profile.photos[0].value;
            var fb_url = profile.profileUrl;
            var fb_id = profile.id;

            console.log(profile.picture);

            User.findOne({fb_id: fb_id}, function(err, user) {
                if (err) { return done(err); }

                if(!user) {
                    user = new User({
                        name: name,
                        email: email,
                        picture_url: picture_url,
                        password: randomString(),
                        fb_id: fb_id,
                        fb_url: fb_url
                    });

                    user.save(function (err) {
                        if (err) done(err);

                        return done(null, user);
                    });
                } else {
                    return done(null, user);
                }
            });
        }));
};