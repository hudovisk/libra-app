var Service = require('./service-model');

var UserController = require('../users/user-controller');

//Return all service posts in db
module.exports.getAllServices = function(req, res, next) {
    //parse query string
    var page = 1;
    var pageSize = 5;
    
    if(req.query.page) page = parseInt(req.query.page);
    if(req.query.pageSize) pageSize = parseInt(req.query.pageSize);

    delete req.query.page;
    delete req.query.pageSize;

    var sort = req.query.sortBy;
    delete req.query.sortBy;

    if(req.query.employee === 'null') req.query.employee = null;
    if(req.query.employer === 'null') req.query.employer = null;

    if(req.query.tags){
        req.query.tags = {"$all" : req.query.tags};
    }

    // Execute query
    if(sort) {
        Service
            .find(req.query)
            .sort(sort)
            .skip((page-1) * pageSize)
            .limit(pageSize)
            .exec(function(err, results) {
                if(err) return next(error);
                return res.json(results);
        });
    } else {
        Service
            .find(req.query)
            .skip((page-1) * pageSize)
            .limit(pageSize)
            .exec(function(err, results) {
                if(err) return next(error);
                return res.json(results);
        });
    }
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

//Update the pause post
module.exports.updateDisablePost = function(req, res, next) {

    Service.findById(req.params.id, function(err, service) {
        if(err)
            return next(err);

        if(String(service.employer) !== String(req.user._id)) 
            return res.status(403).end();
        
        if (service.pause === false)
            service.pause = true;
        else service.pause = false;
       
        service.save(function(err) {
            if(err) return next(err);
            
            var notification = {
                headline: service.pause ? "Paused Post" : "Resumed Post",
                description: "You changed the post <strong>"+service.headline+"</strong>",
                action: "/services/"+service._id,
                read: false
            };

            UserController.pushNotification(req.user._id, notification);
            console.log(notification + " pushed");
            return res.status(200).end();
        });
    });
};


//Create bidding by applicant (first time apply for a job)
module.exports.saveBidding = function(req, res, next) {

    Service.findById(req.params.id, function(err, service) {
        if(err) return next(err);

        //If the applicant is the same as employer/owner of this post then return 403
        if(String(service.employer) == String(req.user._id)) 
            return res.status(403).end();
        else
        {   //else applicant is dif from employer then proceed to create new bidding and update that to the post
            Service.update(
            {
                _id: req.params.id
            },
            {
                $push: {
                    "biddings": {
                        "user": req.user._id,
                        "explanation": req.body.explanation,
                        "value": req.body.value
                    }
                }
            },
            function(err, numOfAffected) {
                console.log(err);
                if(err) return next(err);
                if(numOfAffected === 0) return res.status(404).end();
                return res.status(201).end();
            });
        }  //end if-else
    });
};  //end saveBidding

/*

//Counter-offer the wage by owner (after apllicant applied first time with a set wage)
module.exports.counterBiddingByOwner = function(req, res, next) {

    Service.findById(req.params.id, function(err, service) {
        if(err) return next(err);

        
    });
};  //end saveBidding


//Counter-offer the wage by applicant (after owner counter-offers the wage to applicant)
module.exports.counterBiddingByApplicant = function(req, res, next) {

    Service.findById(req.params.id, function(err, service) {
        if(err) return next(err);

        
    });
};  //end saveBidding

*/

//Get all biddings of a particular service/post
module.exports.getAllBiddings = function(req, res, next) {
    Service.findById(req.params.id)
        .populate('biddings')
        .populate('biddings.user')
        .exec(function(err, user) {
            if(err) return next(err);
            return res.status(200).json(Service.biddings);
        });
};  //end getAllBiddings

