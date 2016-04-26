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

    router.get('/services/:id/biddings',
                requireSession,
                serviceController.getAllBiddings);

	return router;
};