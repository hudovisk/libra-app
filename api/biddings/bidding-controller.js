var Bidding = require('./bidding-model');
var Service = require('../services/service-model');

//Save bidding by applicant
module.exports.saveBidding = function(req, res, next) {

	var flag = false;

	Service.findById(req.params.id, function(err, service) {
        if(err)
            return next(err);

        //If the applicant is the same as employer/owner of this post then return 403
        if(String(service.employer) == String(req.user._id)) 
            return res.status(403).end();
        else
        	flag = true;
    });


	//If applicant is different from employer then proceed to create new bidding and update that to the post
	if(flag)
	{
		new Bidding({
	        user: req.user._id,
	        explanation: req.body.explanation,
	        //value: req.body.value,
	        counterValue: req.body.counterValue
	    }).save(function(err, result){
	          if(err) return next(error);
	          return res.json(result);
	    });


	    Service.findById(req.params.id, function(err, service) {
	        if(err)
	            return next(err);

	        service.biddings.push({ });

	        service.save(function(err) {
	            if(err) return next(err);
	            return res.status(200).end();
        	});
    	});
	}  //end if
};  //end saveBidding