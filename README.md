
[![Build Status](https://travis-ci.org/hudovisk/libra-app.svg?branch=master)](https://travis-ci.org/hudovisk/libra-app) [![Code Climate](https://codeclimate.com/github/hudovisk/libra-app/badges/gpa.svg)](https://codeclimate.com/github/hudovisk/libra-app)

Libra Web App
=============

How to get it running:

 - Install Node: https://nodejs.org/en/download/
 - Install MongoDB: https://docs.mongodb.org/manual/installation/

Install grunt-cli:
```Shell
  npm install -g grunt-cli
```

Install apidoc:
```Shell
  npm install -g apidoc
```

Install bower:
```Shell
  npm install -g bower
```

run MongoDB:
```Shell
    mongod
```

Download and install project dependencies:
```Shell
  git clone https://github.com/hudovisk/libra-app.git
  cd libra-app
  bower install
  npm install
```

Generate docs:
```Shell
    npm run doc
```

Start server:
```Shell
    npm start
```

Resources - Mean Stack
======================

- Full Mean stack (I know it's one hour long but it's totally worth it.) :
  https://www.youtube.com/watch?v=AEE7DY2AYvI

###Backend Dev's:
 - The concept of restful apis: http://www.ibm.com/developerworks/library/ws-restful/
    * Implementation with node + express: 
     https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4
 - Authentication, using passport.js:
   https://scotch.io/courses/easy-node-authentication
    * Passport.js, see how easy it is to implement login with facebook, twitter, google, linkedin ....:
      http://passportjs.org/
    * Not required, but a good resource if you want to know more about sessions in web apps.
      https://www.youtube.com/watch?v=yvviEA1pOXw
 - apiDocs (not much here, just the basic stuff so we can generate documentation
   for the frontend dev's) : http://apidocjs.com/

###Frontend Dev's:
 - Free course from codeschool (relatively fast and easy to follow). 
   http://campus.codeschool.com/courses/shaping-up-with-angular-js/intro
 - Bootstrap (basically for css and responsive design):
   http://getbootstrap.com/getting-started/
