
module.exports = function(app, passport) {
    
    //API - Routes ==================================================
    app.use('/api', require('./api/users/user-router')(passport, requireSession));
    //...

    //Site - Routes ==================================================
    app.get('/', function (req, res) {
        res.sendFile('/index.html', {root: './views'});
    });

    app.get('/login', function(req, res) {
        res.sendFile('/views/login.html', {root: './'});
    });

    app.get('/register', function(req, res) {
        res.sendFile('./views/register.html', {root: './'});
    });       

    app.get('/dashboard', requireSession, function(req, res) {
        res.sendFile('/views/dashboard.html', {root: './'});
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