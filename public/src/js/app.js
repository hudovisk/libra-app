var app = angular.module('libra', []);

app.controller('TestController', function  () {
    this.name = 'Libra';
});

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
                $window.location.href = '/';
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

app.controller('ProfileController', ['$scope', '$http',function($scope, $http){
    
    this.tab = 1;

    $scope.services = [];
    $scope.servicesRequested = [];
    $scope.servicesOffered = [];
    $scope.reviews = [];

    this.init = function (userId) {

        $http({
            method: 'GET',
            url: '/api/services?employee='+userId
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
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