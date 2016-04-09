
var User = require('./api/users/user-model');

module.exports = function(app, passport) {
    
    //API - Routes ==================================================
    app.use('/api', require('./api/users/user-router')(passport, requireSession));
    app.use('/api', require('./api/services/service-router')(requireSession));
    //...

    //Site - Routes ==================================================
    app.get('/', function (req, res) {
        res.render('pages/index.html', {user: req.user});
    });

    app.get('/login', function(req, res) {
        res.render('pages/login.html');
    });

    app.get('/register', function(req, res) {
        res.render('pages/register.html');
    });       

    app.get('/profile/:user_id', function(req, res,  next) {
        console.log("Getting profile for user: " + req.params.user_id);
        User.findById(req.params.user_id, function(err, profile) {
            if(err) return next(err);

            if(profile) {
                res.render('pages/profile.html', {user: req.user, profile: profile});
            }
        });
    });

    app.get('/dashboard', requireSession, function(req, res) {
        res.render('pages/dashboard.html', {user: req.user});
    });

    app.get('/post', function(req, res) {
        res.render('pages/post.html', {user: req.user});
    });
    app.get('/displayPost', function(req, res) {
        res.render('pages/displayPost.html');
    });
    //...

    function requireSession(req, res, next) {
        if(req.isAuthenticated()) {
            return next()
        }

        return res.status(401).json({
                message: 'User not logged in.'
        });
    }

}