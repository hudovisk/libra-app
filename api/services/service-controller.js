var Service = require('./service-model');


//Return current user
module.exports.getMe = function(req, res, next) {
    User.findById(req.user._id, function(err, user) {
        if(err) return next(err);

        res.status(200).json({user: user});
    });
};


//Return all service posts in db
module.exports.getAllServices = function(req, res, next) {
    Service.find({}, function(err, results) {
        if(err) res.json(err);
        res.json(results);
    }); 
};


//Save the service post
module.exports.savePost = function(req, res, next) {
    new service({
        employer:
        headline: req.body.headline;
        description: req.body.description;
        minRange: req.body.minRange;
        maxRange req.body.maxRange;
        tags:
    }).save(function(err, result){
          if(err) res.json(err);
          res.json(result);
    });
};
