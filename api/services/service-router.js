var router = require('express').Router();
var serviceController = require('./service-controller');

module.exports = function(requireSession) 
{
	router.get('/services', 
                serviceController.getAllServices);
	
	router.post('/services',
                requireSession,
	            serviceController.savePost);

    router.put('/services/:id', 
                requireSession,
                serviceController.updatePost);
    
    router.put('/services/:id/pause', 
                requireSession,
                serviceController.updateDisablePost);

	router.delete('/services/:id', 
                requireSession,
                serviceController.deletePost);

    router.post('/services/:id/biddings',
                requireSession,
                serviceController.saveBidding);

    router.put('/services/:id/counterOffer/:bidding_id',
                requireSession,
                serviceController.counter);

    router.get('/services/:id/biddings',
                requireSession,
                serviceController.getAllBiddings);

    router.get('/services/:id/biddings/:bidding_id',
                 requireSession,
                 serviceController.getBidding);

     router.get('/services/:id',
                 requireSession,
                 serviceController.getService);

     router.delete('/services/:id/biddings/:bidding_id',
                 requireSession,
                 serviceController.deleteBidding);

     router.put('/services/:id/biddings/:bidding_id',
                 requireSession,
                 serviceController.acceptservice);

	return router;
};