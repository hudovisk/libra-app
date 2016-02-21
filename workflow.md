Workflow
========

**Work in progress**

By the end of this week I will create the official github repo with a directory structure so we can start coding next week.

**Any feedback or question is wellcome and fell free to correct the typos and misspellings**

##1.Taiga
Choose a feature/task (based on the sprint plan and priority) from kanban, assign it to yourself and move it to the in progress tab.

##2.Git
After selecting the feature/task from taiga you have to create a new branch from the master branch.
 
 - Make sure you are on the updated master brach:
```Shell
    git checkout master
    git pull origin master
```

 - Create the new branch and checkout into it:

> **recommendation:** Use the task number in taiga as part of the name of the brach ex: 13-user_register

```Shell
    git checkout -b BRANCHNAME
```

##3.Coding
> **Note:** This section is more focused on backend development.
> I am not sure if we need to implement tests for the frontend as the logic is more 
> on the backend side.

After you have your git branch setup you can start coding. Here are some recomendations:

 - Before implementing the feature think of how you can test it.
>Ex: User register:  
> 1. Should validate the fields received by the post method.  
> 2. Should return the registered user as a JSON response.  
 
 - Implement those tests and watch them fail.
    * Check my sample code to an example: https://github.com/hudovisk/web-app

 - Implement the feature and make sure the tests succeed.

> **Note:** Whenever you push your commit to github, Travis-CI will run your tests remotely 
> so you can be sure that your code will run in the production server and not only your local enviromnent.
> To also run the tests locally use:
```Shell
    grunt test
```

##4.Pull requests
Whenever you feel stuck with your code and need help with it or you feel that your code is tested and ready to be in production you make a pull request and mention someone else to review your code and test it locally. Make sure to move the corresponding task in taiga to the ready to test tab.

###Reviwer
 - Look through the unified diff and give feedback about the code in the pull request discussion.

 - Check Travis CI results.

 - Save any changes you are working on your current branch before checking out other people branch:
```Shell
    git commit -m"message"
```

 - Merge master into the pull request branch locally and test it
```Shell
    git fetch origin pull/ID/head:BRACHNAME
    git checkout BRANCHNAME
    git merge master
```

 - Run it locally:
```Shell
    npm install
    npm test
    npm start
```

 - If everything is ok, merge it with the master branch.
```Shell
    git checkout master
    git pull origin master
    git merge --no-ff BRANCHNAME
    git push origin master
```

 - Move the corresponding task on taiga to done tab.

 - After merged you can delete the branch and start working on your next feature.

>**Note:** I am also working in integrating the minify phase of the javascript and css files to use
> in the production version.


Tools used
==========

##Git:
Git rules:
 - Anything in the master branch is deployable.
 - To work on something new, create a descriptively named branch off of master (ie: new-oauth2-scopes).
 - Commit to that branch locally and regularly push your work to the same named branch on the server.
 - When you need feedback or help, or you think the branch is ready for merging, open a pull request.
 - After someone else has reviewed and signed off on the feature, you can merge it into master.
 - Once it is merged and pushed to ‘master’, you can and should deploy immediately.

Really good article about it (must read): http://scottchacon.com/2011/08/31/github-flow.html

##Travis CI:
Whenever you push your code travis will run all test's in a test enviromnent to guarantee that your code doesn't brake anything.

##Grunt:
Task automator, its a tool we will use to run tests and produce minified versions of our javascript and css. Grunt can also watch for file changes and run tasks whenever the files are changed. Ex: restart the server whenever we change any of the server files, so we dont have to do this ourselfs.

##Test Framework
###Mocha, Chai, supertest, mockgoose
Mocha is the test runner while cai provide an assert library to be used with mocha. Supertest makes it easy to test http requests and mockgoose simulates the database in memory for testing.

###JSHint:
Static code analyzer that looks into code style and possible errors.

###Github Webhooks:
I created another webserver that listens in a different port (30000) and whenever the master branch gets pushed, github will post to this webserver that will trigger a shell script that pull the latest code into the ec2 instance and restarts the server to deploy.

