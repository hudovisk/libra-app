/*jshint expr: true*/
//Supress jshint warning: 'Expected an assignment or function call and instead saw an expression.'

var expect = require('chai').expect;  
var request = require('supertest');  
var async = require('async');

var User = require('../../api/users/user-model');
var server = require('../../server');

var savedUserData = {
    name: 'saved',
    email: 'exist@test.com',
    password: 'validpassword1*'
};

describe('post api/users/register', function() {

    before( function(done) {
    // runs before all tests in this block
        savedUser = new User(savedUserData);
        savedUser.save(done);
    });

    after( function(done) {
    // runs after all tests in this block
        User.find({}).remove(done);
    });

    it('should validate fields and check for existent email.', function(done) {
        var shortPassword = {name: 'test1', email:'test1@test.com', password: 'aa'};
        var longPassword = {name: 'test1', email:'test1@test.com', password: 'aaaaaaaaaaaaaaaaaaaaaa'};
        var existentEmail = {name: 'test1', email: savedUserData.email, password: 'validPassword1*'};

        //Alisases
        var api = '/api/users/register';
        var req = request(server);

        async.parallel([
            function(cb) { req.post(api).send(shortPassword).expect(400, cb); },
            function(cb) { req.post(api).send(longPassword).expect(400, cb); },
            function(cb) { req.post(api).send(existentEmail).expect(409, cb); },
        ], done);

    });

    it('should return 201 and the registered user', function(done) {
        var validUser = {
            name: 'valid',
            email: 'dontExist@test.com',
            password: 'validpassword1*'
        };

        var validBody = function(res) {
            validateUser(res.body, validUser);
        };

        //TODO(Hudo): Test cookie

        request(server)
            .post('/api/users/register')
            .send(validUser)
            .expect(201)
            .expect(validBody)
            .end(done);
    });

});

describe('post api/users/login', function() {

    before( function(done) {
    // runs before all tests in this block
        savedUser = new User(savedUserData);
        savedUser.save(done);
    });

    after( function(done) {
    // runs after all tests in this block
        User.find({}).remove(done);
    });

    it('should return 401', function(done) {
        var invalidLogin = {
            email: "invalid@email.com",
            password: "validPassword1*"
        };

        request(server)
            .post('/api/users/login')
            .send(invalidLogin)
            .expect(401)
            .end(done);        

    });

    it('should return 200 and the logged user', function(done) {
        var validLogin = {
            email: savedUserData.email,
            password: savedUserData.password
        };

        var validBody = function(res) {
            validateUser(res.body, savedUserData);
        };

        //TODO(Hudo): Test cookies.

        request(server)
            .post('/api/users/login')
            .send(validLogin)
            .expect(200)
            .expect(validBody)
            .end(done);

    });
});


describe('post api/users/logout', function() {

    var loggedAgent = request.agent(server);

    before( function(done) {
    // runs before all tests in this block
        savedUser = new User(savedUserData);
        savedUser.save(function(err) {
            expect(err).to.be.null;
            loginAgent(loggedAgent, savedUserData, done);
        });
    });

    after( function(done) {
    // runs after all tests in this block
        User.find({}).remove(done);
    });

    it('should return 200 and clear the cookies', function(done) {
        loggedAgent
            .post('/api/users/logout')
            .expect(200)
            .expect(function(res) { expect(res.headers['set-cookie']).to.be.undefined; })
            .end(done);  
    });
});

describe('get api/users/me', function() {

    var loggedAgent = request.agent(server);

    before( function(done) {
    // runs before all tests in this block
        savedUser = new User(savedUserData);
        savedUser.save(function(err) {
            expect(err).to.be.null;
            loginAgent(loggedAgent, savedUserData, done);
        });
    });

    after( function(done) {
    // runs after all tests in this block
        User.find({}).remove(done);
    });

    it('should return 200 with the current user', function(done) {
        var validBody = function(res) {
            validateUser(res.body, savedUserData);
        };

        loggedAgent
            .get('/api/users/me')
            .expect(200)
            .expect(validBody)
            .end(done);  
    });
});

describe('get api/users', function() {
    var loggedAgent = request.agent(server);

    var users = [
        {
            name: "name1",
            email: "email1@email.com",
            password: "validPassword1*"
        },
        {
            name: "name2",
            email: "email2@email.com",
            password: "validPassword2*"
        },
        {
            name: "name3",
            email: "email3@email.com",
            password: "validPassword3*"
        }
    ];

    before( function(done) {
    // runs before all tests in this block
        User.create(users, function (err, savedUsers) {
            if(err) done(err);
            loginAgent(loggedAgent, users[0], done);
        });
    });

    after( function(done) {
    // runs after all tests in this block
        User.find({}).remove(done);
    });

    it('should return 200 with all users', function(done) {
        var validBody = function(res) {
            expect(res.body).to.not.be.undefined;
            expect(res.body.length).to.equal(users.length);
        };

        loggedAgent
            .get('/api/users')
            .expect(200)
            .expect(validBody)
            .end(done);  
    });
});

function validateUser(receivedUser, validUser) {
    expect(receivedUser).to.not.be.undefined;
    expect(receivedUser.name).to.equal(validUser.name);
    expect(receivedUser.email).to.equal(validUser.email);
    expect(receivedUser.password).to.be.undefined;
}

function loginAgent(agent, userData, done) {
    var validLogin = {
            email: userData.email,
            password: userData.password
    };

    agent
        .post('/api/users/login')
        .send(validLogin)
        .expect(200)
        .end(done);        
}
