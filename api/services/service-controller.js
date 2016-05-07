var Service = require('./service-model');

var UserController = require('../users/user-controller');

//Return all service posts in db
module.exports.getAllServices = function(req, res, next) {
    //parse query string

    var page = req.query.page ? parseInt(req.query.page) : 1;
    var pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 5;

    //TODO(Hudo): Sanitize req.query.q ?
    var query = {};
    
    console.log(req.query);

    if(req.query.q) {
        query.$text = { $search: req.query.q };
    }

    if(req.query.tags) {
        query.tags = { $in: req.query.tags };
    }

    if (req.query.minWage) {
        query.minRange = { $gte: parseInt(req.query.minWage) };
    }

    if (req.query.maxWage) {
        query.maxRange = { $lte: parseInt(req.query.maxWage) };
    }

    if (req.query.employer === "null") {
        query.employer = null;
    }

    if (req.query.employee === "null") {
        query.employee = null;
    }

    var options = {
        select: { score : { $meta: "textScore" } },
        sort: (req.query.sortBy === "date") ? "-created" : { score : { $meta : 'textScore' } },
        populate: ["employer", "employee"],
        lean: true,
        page: page,
        limit: pageSize
    };

    Service
        .paginate(query, options)
        .then(function(result) {
            return res.json(result);
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

//Update the pause post
module.exports.acceptservice = function(req, res, next) {

    Service.findById(req.params.id, function(err, service) {
        if(err)
            return next(err);

        if(String(service.employer) === String(req.body.employee)) 
            return res.status(403).end();

        var notification = {};

        if(String(service.employer) === String(req.user._id)) {
            notification = {
                headline: "Congratulations!",
                description: "You have been accepted for this job. Here is $" +req.body.money+ " upfront!",
                action: "/",
                read: false
            };
            UserController.pushNotification(req.body.employee, notification);
        } else {
            notification = {
                headline: req.user.name+" agreed to your terms",
                description: req.user.name+" accepted the job! $"+req.body.money+"Has been sent to his account.",
                action: "/",
                read: false
            };
            UserController.pushNotification(service.employer, notification);
        }

        console.log(service.employee + " pushed");
       
        Service.update(
            {
                _id: req.params.id
            },
            {
                $push: {
                    "employee": req.body.employee._id
                }
            },
            function(err, numOfAffected) {
                console.log(req.body.employee._id + " test");
                if(err) return next(err);
                if(numOfAffected === 0) return res.status(404).end();
                return res.status(200).end();
            });
    });
};

//Create bidding by applicant (first time apply for a job)
module.exports.saveBidding = function(req, res, next) {

    Service.findById(req.params.id, function(err, service) {
        if(err) return next(err);

        //If the applicant is the same as employer/owner of this post then return 403
        if(String(service.employer) === String(req.user._id)) 
            return res.status(403).end();
        else
        {   //else applicant is dif from employer then proceed to create new bidding and update that to the post
            var bidding = service.biddings.create({
                user: req.user._id,
                explanation: req.body.explanation,
                value: parseInt(req.body.value)
            });
            service.biddings.push(bidding);
            service.save(function(err, numOfAffected) {
                if(err) return next(err);
                if(numOfAffected === 0) return res.status(404).end();
 
                console.log('id ' + bidding._id);

                var notification = {
                    headline: req.user.name+" applied for your job!",
                    description: req.body.value +" was his desired offer. <br>Description: " + req.body.explanation,
                    action: "/services/"+service._id+"/"+bidding._id,
                    read: false
                };

                UserController.pushNotification(service.employer, notification);
                console.log(notification + " pushed");
            });
        }  //end if-else
    });
};  //end saveBidding

module.exports.getBidding = function(req, res, next) {
     Service.findById(req.params.id)
         .populate('biddings')
         .populate('biddings.user')
         .exec(function(err, service) {
             if(err) return next(err);
             for (var i = service.biddings.length - 1; i >= 0; i--) {
                 if(String(service.biddings[i]._id) === String(req.params.bidding_id))
                     return res.status(200).json(service.biddings[i]);
             }
             return res.status(404).json();
         });
 };  //end getBidding

 module.exports.getService = function(req, res, next) {
    console.log("=====HERE=====");
     Service.findById(req.params.id)
         .exec(function(err, service) {
             if(err) return next(err);
             
            return res.status(200).json(service);
             
            
         });
 };  //end getBidding


//Counter-offer the wage by owner (after apllicant applied first time with a set wage)
module.exports.counter = function(req, res, next) {
    Service.findById(req.params.id, function(err, service) {
        if(err) return next(err);

        var notification = {};

        if(String(service.employer) === String(req.user._id)) {
            notification = {
                headline: "Employer "+req.user.name+" has made a counter offer!",
                description: "Counter offer of $"+req.body.value+" has been made for "+service.headline,
                action: "/services/"+service._id+"/"+req.params.bidding_id,
                read: false
            };
            
            UserController.pushNotification(req.body.employee, notification);
        }
        else
        {  //else not the same person
            notification = {
                headline: "Applicant "+req.user.name+" has made a counter offer!",
                description: "Counter offer of $"+req.body.value+" has been made for "+service.headline,
                action: "/services/"+service._id+"/"+req.params.bidding_id,
                read: false
            };
            
            UserController.pushNotification(service.employer, notification);
        }  //end if-else
           
        Service.update(
            {
                _id: req.params.id,
                "biddings._id": req.params.bidding_id
            },
            {
                $set: {
                    "biddings.$.explanation": req.body.explanation,
                    "biddings.$.value": req.body.value
                }
            },
            function(err, numOfAffected) {
                if(err) return next(err);
                if(numOfAffected === 0) return res.status(404).end();
                return res.status(200).end();
            });
    });
};  //end saveBidding


module.exports.deleteBidding = function(req, res, next) {
    Service.findById(req.params.id, function(err, service) {
        if(err) return next(err);

        var notification = {};

        if(String(service.employer) === String(req.user._id)) {

            var applicantId;
            service.biddings.some(function (bidding) {
                if(String(bidding._id) === String(req.params.bidding_id)) {
                    applicantId = bidding.user;
                    return true;
                } else {
                    return false;
                }
            });
            
            console.log("Applicant id: " + applicantId);

            notification = {
                headline: "You did not qualify for this job application process!",
                description: "Sorry!",
                action: "/",
                read: false
            };
            UserController.pushNotification(applicantId, notification); //how to send to applicantId? req.user._id is employerId which i dont want
        } else {
            notification = {
                headline: req.user.name+" withdrew from the job application process!",
                description: "Sorry!",
                action: "/",
                read: false
            };
            UserController.pushNotification(service.employer, notification);
        }

        console.log(notification + " pushed");

        Service.update(
        {
            _id: req.params.id
        },
        {
            $pull: {
                biddings: { 
                    _id: req.params.bidding_id 
                } 
            }
        },
        function(err, numOfAffected) {
            if(err) return next(err);
            if(numOfAffected === 0) return res.status(404).end();
            
            return res.status(200).end();
        });
    });
 };  //end deleteBidding

//Get all biddings of a particular service/post
module.exports.getAllBiddings = function(req, res, next) {
    Service.findById(req.params.id)
        .populate('biddings')
        .populate('biddings.user')
        .exec(function(err, service) {
            if(err) return next(err);
            return res.status(200).json(service.biddings);
        });
};  //end getAllBiddings


//Get bidding of an applicant of a particular service
module.exports.getBidding = function(req, res, next) {
    Service.findById(req.params.id)
        .populate('biddings')
        .populate('biddings.user')
        .exec(function(err, service) {
            if(err) return next(err);
            for (var i = service.biddings.length - 1; i >= 0; i--) {
                if(String(service.biddings[i]._id) === String(req.params.bidding_id))
                    return res.status(200).json(service.biddings[i]);
            }
            return res.status(404).json();
        });
};  //end getBidding

