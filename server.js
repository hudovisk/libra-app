//Modules & set up =========================================================
var express      = require('express');
var app          = express();
var port         = 1337 || process.env.PORT;
var morgan       = require('morgan');
var session      = require('express-session');
var bodyParser   = require('body-parser');
var passport     = require('passport');
var mongoose     = require('mongoose');
var credentials  = require('./config/credentials');
var aws          = require('aws-sdk');
const MongoStore = require('connect-mongo')(session);

var AWS_ACCESS_KEY  = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY  = process.env.AWS_SECRET_KEY;

//Config =========================================================
mongoose.connect(credentials.db.url);

aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});

//config passport
require('./config/passport')(passport);

//app middlewares
//only show logs with arent testing
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}
app.use(express.static(__dirname + '/public'));

// set the view engine to ejs
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//TODO(Hudo): Check all config options for session in the docs.
app.use(session({
    secret: credentials.sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());

//Routes =========================================================
require('./routes')(app, passport, aws)

//Server ========================================================= 
app.listen(port, function() {
    console.log('Listenning on port: ' + port);
});

module.exports = app;
module.exports.mongoose = mongoose;