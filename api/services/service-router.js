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

	return router;
};