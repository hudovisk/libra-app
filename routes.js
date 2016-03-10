
module.exports = function(app, passport) {
    
    //API - Routes ==================================================
    app.use('/api', require('./api/users/user-router')(passport, requireSession));
    app.use('/api', require('./api/services/service-router')(requireSession));
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

    app.get('/dashboard', requireSession, function(req, res) {
        res.render('pages/dashboard.html', {user: req.user});
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