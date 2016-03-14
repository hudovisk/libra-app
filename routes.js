
var User = require('./api/users/user-model');

module.exports = function(app, passport) {
    
    //API - Routes ==================================================
    app.use('/api', require('./api/users/user-router')(passport, requireSession));
    app.use('/api', require('./api/services/service-router')(requireSession));
    app.use('/api/users/:user_id', requireSession, require('./api/users/review-router'));
    //...

    //Site - Routes ==================================================
    app.get('/', function (req, res) {
        if(req.isAuthenticated()) {
            res.redirect('/dashboard');
        } else {
            res.render('pages/index.html');
        }
    });

    app.get('/login', function(req, res) {
        res.render('pages/login.html');
    });

    app.get('/register', function(req, res) {
        res.render('pages/register.html');
    });       

    app.get('/profile/:user_id', function(req, res,  next) {
        console.log("Getting profile for user: " + req.params.user_id);
        User.findById(req.params.user_id, function(err, user) {
            if(err) return next(err);

            if(user) {
                res.render('pages/profile.html', {user: user});
            }
        });
    });

    app.get('/dashboard', requireSession, function(req, res) {
        res.render('pages/dashboard.html', {user: req.user});
    });

    app.get('/post', function(req, res) {
        res.render('pages/post.html', {user: req.user});
    });
    //...

    function requireSession(req, res, next) {
        if(req.isAuthenticated()) {
            return next()
        }

        res.status(401).json({
                message: 'User not logged in.'
        });
    }

}