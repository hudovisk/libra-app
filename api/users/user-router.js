var router = require('express').Router();
var userController = require('./user-controller');

//Users API - passport and session dependecy
module.exports = function(passport, requireSession) {
    /**
     * @api {get} /users List all users
     * @apiName getUsers
     * @apiGroup users
     *
     * @apiSuccess {Object[]} . All users.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          {
     *              "_id": "56beb5c09a2b85152930d9f5",
     *              "name": "test",
     *              "email": "aa",
     *              "__v": 0
     *          },
     *          {
     *              "_id": "56bec35288c2a8692ac3f144",
     *              "name": "Hudo",
     *              "email": "hudo",
     *              "__v": 0
     *          },
     *          ...
     *     }
     */
    router.get('/users',
               requireSession,
               userController.getAll);

    /**
     * @api {post} /users/register Register a user
     * @apiName register
     * @apiGroup users
     *
     * @apiParam {String} name       Name of the user.
     * @apiParam {String} email      Email of the user.
     * @apiParam {String} password   Password of the user.
     * 
     * @apiSuccess {Object} user User registered and logged in.
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "user": {
     *              "_id": "56beb5c09a2b85152930d9f5",
     *              "name": "test",
     *              "email": "aa",
     *              "__v": 0
     *          }
     *     }
     */
    router.post('/users/register', function(req, res, next) {
                userController.register(passport, req, res, next);
    });
    
    /**
     * @api {post} /users/login Login a user
     * @apiName login
     * @apiGroup users
     *
     * @apiParam {String} email      Email of the user.
     * @apiParam {String} password   Password of the user.
     *
     * @apiSuccess {Object} user User logged in.
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "user": {
     *              "_id": "56beb5c09a2b85152930d9f5",
     *              "name": "test",
     *              "email": "aa",
     *              "__v": 0
     *          }
     *      }
     */    
    router.post('/users/login', function(req, res, next) {
                userController.login(passport, req, res, next);
    });

    router.get('/users/login/facebook',
                function(req, res, next) {
                    console.log("http://"+process.env.HOST || 'localhost'+"/api/users/login/facebook/callback");
                    next();
                },
                passport.authenticate('facebook', {
                    authType: 'rerequest',
                    scope: ['public_profile', 'email'] 
                }));

    router.get('/users/login/facebook/callback',
                passport.authenticate('facebook', { failureRedirect: '/login' }),
                    function(req, res) {
                    // Successful authentication, redirect home.
                    res.redirect(req.redirectUrl);
                    // res.status(200).json({});
                });

    /**
     * @api {post} /users/logout Logout a user
     * @apiName logout
     * @apiGroup users
     *
     * @apiSuccess {Sring} message Returned message.
     *
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "message": "User logout successfully"     
     *     }
     */
    router.post('/users/logout',
                requireSession,
                userController.logout);

    /**
     * @api {get} /users/me Get the logged user
     * @apiName getMe
     * @apiGroup users
     *
     * @apiSuccess {Object} user Current logged user.
     *
     * @apiSuccessExample {json} Success-Response:
     * 
     *     HTTP/1.1 200 OK
     *     {
     *        "user": {
     *            "_id": "56bec35288c2a8692ac3f144",
     *            "name": "Hudo",
     *            "email": "hudo",
     *            "__v": 0
     *        }
     *     }
     */
    router.get('/users/me',
                requireSession,
                userController.getMe);

    router.put('/users/me',
                requireSession,
                userController.updateUser);

    router.get('/users/me/connect/facebook',
                requireSession,
                passport.authenticate('facebook', {
                    authType: 'rerequest',
                    scope: ['public_profile', 'email'] 
                }));

    router.get('/users/me/disconnect/facebook',
                requireSession,
                userController.disconnectFacebook);

    router.put('/users/me/password',
                requireSession,
                userController.updatePassword);

    router.get('/users/:user_id',
                requireSession,
                userController.getUser);

    router.get('/users/:user_id/reviews',
                requireSession,
                userController.getAllReviews);

    router.post('/users/:user_id/reviews',
                requireSession,
                userController.pushReview);
    
    router.put('/users/:user_id/reviews/:review_id',
                requireSession,
                userController.updateReview);

    router.delete('/users/:user_id/reviews/:review_id',
                requireSession,
                userController.deleteReview);

return router;

};
