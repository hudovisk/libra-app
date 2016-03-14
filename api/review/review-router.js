var router = require('express').Router();
var reviewController = require('./review-controller');

//Review API
module.exports = function() {
    
    router.get('/reviews',
               reviewController.getAll);

    
    router.post('/reviews',
                reviewController.saveReview);
    
       
    router.put('/reviews/:review_id'
                reviewController.editReview);

    
    router.delete('/reviews/:review_id',
                reviewController.deleteReview);

return router;

};
