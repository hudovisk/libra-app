var app = angular.module('libra', ['hc.marked']);

app.config(['markedProvider', function (markedProvider) {
  markedProvider.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
  });
}]);

app.controller('cardCtrl', function ($scope, $http, $window){
     $http.get('/api/services').then(function(result) {
        $scope.messages = result.data;
        console.log($scope.messages);
       
    });


});//controller

app.controller('PostCtrl', function ($scope, $http, $window){
    var userid;
    $http.get('/api/users/me').then(function(result) {
        $scope.userId = result.data._id;
        userid = $scope.userId;
    });

     $scope.postserv = function (serv) {
        $http({
            method: 'POST',
            url: '/api/services',
            data: {
                employer: userid,
                headline: serv.headline,
                description: serv.des,
                minRange: serv.min,
                maxRange: serv.max,
                tags: serv.tag
            }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
                $window.location.href = '/dashboard';
            
            //TODO: Display duplicate email!
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            
        });//then
    };//serv scope

});//controller

app.controller("ServiceController", function() {
    this.latestServices = [
        {
            headline: "Lorem ipsum dolor sit amet.",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat, lacus quis tristique venenatis, ante tellus iaculis justo, id elementum ante urna sed mi. Nam.",
            tags: ["dolor", "sit", "amet"]
        },
        {
            headline: "Lorem ipsum dolor sit amet.",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat, lacus quis tristique venenatis, ante tellus iaculis justo, id elementum ante urna sed mi. Nam.",
            tags: ["dolor", "sit", "amet"]
        },
        {
            headline: "Lorem ipsum dolor sit amet.",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat, lacus quis tristique venenatis, ante tellus iaculis justo, id elementum ante urna sed mi. Nam.",
            tags: ["dolor", "sit", "amet"]
        },
        {
            headline: "Lorem ipsum dolor sit amet.",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat, lacus quis tristique venenatis, ante tellus iaculis justo, id elementum ante urna sed mi. Nam.",
            tags: ["dolor", "sit", "amet"]
        },
        {
            headline: "Lorem ipsum dolor sit amet.",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat, lacus quis tristique venenatis, ante tellus iaculis justo, id elementum ante urna sed mi. Nam.",
            tags: ["dolor", "sit", "amet"]
        },
        {
            headline: "Lorem ipsum dolor sit amet.",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat, lacus quis tristique venenatis, ante tellus iaculis justo, id elementum ante urna sed mi. Nam.",
            tags: ["dolor", "sit", "amet"]
        },
    ];
});

app.controller('RegisterController', ['$scope', '$http', '$window', function($scope, $http, $window){

    $scope.register = function (user) {
        $http({
            method: 'POST',
            url: '/api/users/register',
            data: {
                email: user.email,
                password: user.password,
                name: user.name
            }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            if (response.status === 201) {
                $window.location.href = '/dashboard';
            }
            //TODO: Display duplicate email!
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            if (response.status == 401) {
               
            }
        });
    };
}]);

app.controller('UserController', ['$scope', '$http', '$window', function($scope, $http, $window){
    
    var loginError = false;

    $scope.loginError = function() {
        return loginError;
    };

    $scope.login = function (user) {
        $http({
            method: 'POST',
            url: '/api/users/login',
            data: {
                email: user.email,
                password: user.password
            }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            if (response.status === 200) {
                $window.location.href = '/dashboard';
            }
            //TODO: Display duplicate email!
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            if (response.status == 401) {
                loginError = true;
            }
        });
    };

    $scope.logout = function () {
        $http({
            method: 'POST',
            url: '/api/users/logout'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            if (response.status === 200) {
                $window.location.href = '/';
            }
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log(response);
        });
    };

}]);

app.controller('ProfileController', ['$scope', '$http', '$window', function($scope, $http, $window){
    
    this.tab = 1;
    this.editMode = false;
    this.originalDescription = '';

    $scope.me = {};

    $scope.profile = {};
    $scope.services = [];
    $scope.servicesRequested = [];
    $scope.servicesOffered = [];
    $scope.reviews = [];

    $scope.delPost = function (serviceid){
        event.preventDefault();
        alert(serviceid);
        $http({
                method: 'DELETE',
                url: '/api/services/'+serviceid
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                
            }, function errorCallback(response) {
                console.log(response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });//then        

    }; //delete the post

    this.init = function (userId) {
        parent = this;

        $http({
            method: 'GET',
            url: '/api/users/me'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            if (response.status === 200) {
                $scope.me = response.data;
            }
        }, function errorCallback(response) {
            console.log(response);
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });        

        $http({
            method: 'GET',
            url: '/api/users/'+userId
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            if (response.status === 200) {
                $scope.profile = response.data;
                parent.originalDescription = $scope.profile.description;
            }
        }, function errorCallback(response) {
            console.log(response);
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });        

        $http({
            method: 'GET',
            url: '/api/services?employee='+userId
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available

            //jobs requested call

            if (response.status === 200) {
                $scope.servicesOffered = response.data;
            }
        }, function errorCallback(response) {
            console.log(response);
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

        $http({
            method: 'GET',
            url: '/api/services?employer='+userId
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            if (response.status === 200) {
                $scope.servicesRequested = response.data;
            }
        }, function errorCallback(response) {
            console.log(response);
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

        $http({
            method: 'GET',
            url: '/api/users/'+userId+'/reviews'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            if (response.status === 200) {
                $scope.reviews = response.data;
            }
        }, function errorCallback(response) {
            console.log(responde);
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

    };

    this.cancelDescription = function() {
        $scope.profile.description = this.originalDescription;
        this.setEditMode(false);
    };

    this.saveDescription = function(description) {
        $http({
            method: 'PUT',
            url: '/api/users/me',
            data: {
                description: description
            }
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            if (response.status === 200) {
                $window.location.reload();
            }
        }, function errorCallback(response) {
            console.log(responde);
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };

    $scope.range = function(n) {
        return new Array(n);
    };

    this.setTab = function(setTab) {
        if(setTab === 2) $scope.services = $scope.servicesRequested;
        if(setTab === 3) $scope.services = $scope.servicesOffered;
        this.tab = setTab;
    };

    this.isTabSelected = function(selectTab) {
        return this.tab === selectTab;
    };

    this.isEditMode = function() {
        return this.editMode;
    };

    this.setEditMode = function(mode) {
        this.editMode = mode;
    };

    $scope.isOwnProfile = function() {
        return String($scope.me._id) === String($scope.profile._id);
    }

}]);//end of profileController

app.controller('DashboardController', ['$scope', '$http', function($scope, $http){
    
    $scope.latestServicesRequested = [];
    $scope.latestServicesOffered = [];

    $http({
            method: 'GET',
            url: '/api/services/?sortBy=-created&employer=null&pageSize=5'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            if (response.status === 200) {
                $scope.latestServicesRequested = response.data;
            }
        }, function errorCallback(response) {
            console.log(response);
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

    $http({
            method: 'GET',
            url: '/api/services/?sortBy=-created&employee=null&pageSize=5'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            if (response.status === 200) {
                $scope.latestServicesOffered = response.data;
            }
        }, function errorCallback(response) {
            console.log(response);
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

}]);

app.directive("serviceCarouselDesc", function() {
    return {
        restrict: 'E',
        templateUrl: "/views/partials/serviceCarouselDesc.html"
    };
});

app.directive('profileServicesList', function() {
    return {
        restrict: 'E',
        templateUrl: "/views/partials/profileServicesList.html"
    };
});

app.directive('profileReviewsTab', function() {
    return {
        restrict: 'E',
        templateUrl: "/views/partials/profileReviewsTab.html"
    };
});