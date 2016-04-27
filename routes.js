
var User = require('./api/users/user-model');

var S3_BUCKET = process.env.S3_BUCKET;

module.exports = function(app, passport, aws) {
    
    //API - Routes ==================================================
    app.use('/api', require('./api/users/user-router')(passport, requireSession));
    app.use('/api', require('./api/services/service-router')(requireSession));
    //...

    //Site - Routes ==================================================
    app.get('/', function (req, res) {
        res.render('pages/index.html', {user: req.user});
    });

    app.get('/login', function(req, res) {
        if(req.isAuthenticated()) {
            return res.redirect('/');
        }
        res.render('pages/login.html');
    });

    app.get('/register', function(req, res) {
        if(req.isAuthenticated()) {
            return res.redirect('/');
        }
        res.render('pages/register.html');
    });

    app.get('/settings', function(req, res) {
        res.render('pages/settings.html', {user: req.user});
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

    app.get('/sign_s3', function(req, res){
        var key = req.query.file_name+String(req.user._id);
        var s3 = new aws.S3();
        var s3_params = {
            Bucket: S3_BUCKET,
            Key: key,
            Expires: 60,
            ContentType: req.query.file_type,
            ACL: 'public-read'
        };
        s3.getSignedUrl('putObject', s3_params, function(err, data){
            if(err){
                console.log(err);
            }
            else{ 
                return res.json({
                    signed_request: data,
                    url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+key
                });
            }
        });
    });

    app.get('/search', function(req, res) {
        res.render('pages/search.html', {user: req.user});
    });

    app.get('/displayPost', function(req, res) {
        res.render('pages/displayPost.html', {user: req.user});
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