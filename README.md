
Login sample with Node.js + Express + Passport.
================================================

Install Node: https://nodejs.org/en/download/

Install MongoDB: https://docs.mongodb.org/manual/installation/

run MongoDB:
```Shell
    mongod
```

Start server:
```Shell
    git clone https://github.com/hudovisk/web-app.git
    cd web-app
    npm install
    npm start
```

Generate docs:
```Shell
    npm install -g apidoc
    apidoc -i api/ -o apidoc/
```

If you want install the frontend libs run (inside web-app folder):
```Sheel
    npm install -g bower
    bower install
```

Access:
 - htpp://localhost:1337/
 - htpp://localhost:1337/dashboard
 - htpp://localhost:1337/login
 - htpp://localhost:1337/register
 - htpp://localhost:1337/api/users
 - htpp://localhost:1337/api/users/me
 - POST htpp://localhost:1337/logout

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