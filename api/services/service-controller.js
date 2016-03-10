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
        if(err) return next(error);
        console.log(results);
        res.json(results);
    }); 
};


//Save the service post
module.exports.savePost = function(req, res, next) {
    new service({
        employer: req.user._id,
        headline: req.body.headline,
        description: req.body.description,
        minRange: req.body.minRange,
        maxRange: req.body.maxRange,
        tags: req.body.tags
    }).save(function(err, result){
          if(err) return next(error);
          res.json(result);
    });
};
