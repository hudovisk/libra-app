var Service = require('./service-model');

//Return all service posts in db
module.exports.getAllServices = function(req, res, next) {
    if(req.query.tags){
        req.query.tags = {"$all" : req.query.tags};
    }
    Service.find(req.query, function(err, results) {
        if(err) return next(error);
        return res.json(results);
    }); 
};

//Save the service post
module.exports.savePost = function(req, res, next) {
    new Service({
        employer: req.user._id,
        headline: req.body.headline,
        description: req.body.description,
        minRange: req.body.minRange,
        maxRange: req.body.maxRange,
        tags: req.body.tags
    }).save(function(err, result){
          if(err) return next(error);
          return res.json(result);
    });
};

//Delete the service post
module.exports.deletePost = function(req, res, next) {

    Service.findById(req.params.id, function(err, service) {
        if(err) 
            return next(err);
        if(String(service.employer) !== String(req.user._id)) 
            return res.status(403).end();
        service.remove(function(err) {
            if(err) return next(err);
            return res.status(200).end();
        });
    });    
};

//Update the service post
module.exports.updatePost = function(req, res, next) {

    Service.findById(req.params.id, function(err, service) {
        if(err)
            return next(err);

        if(String(service.employer) !== String(req.user._id)) 
            return res.status(403).end();
        
        service.headline = req.body.headline;
        service.description = req.body.description;
        service.minRange = req.body.minRange;
        service.maxRange = req.body.maxRange;
        service.tags = req.body.tags;
        service.save(function(err) {
            if(err) return next(err);
            return res.status(200).end();
        });
    });
};