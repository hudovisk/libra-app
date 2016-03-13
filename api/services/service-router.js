var router = require('express').Router();
var serviceController = require('./service-controller');

module.exports = function(requireSession) 
{
	router.get('/services', serviceController.getAllServices);
	
	router.post('/services', requireSession, function(req, res, next) {
	            serviceController.savePost(req, res, next);
	        });

	router.post('/services/delete', requireSession, function(req, res, next) {
	            serviceController.deletePost(req, res, next);
	        });

	return router;
};