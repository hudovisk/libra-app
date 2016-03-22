var app = angular.module('libra', ['ngMaterial']);
//<!-- var app2 = angular.module('post', []); -->
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

app.directive("serviceCarouselDesc", function() {
    return {
        restrict: 'E',
        templateUrl: "/views/partials/serviceCarouselDesc.html"
    };
});


app.controller('', ['$scope', '$http', function ($scope, $http) {
        'use strict';
 $scope.test = "Testing 1 2 3 ";
 $scope.messages =[];
        getFromServer();
        function getFromServer(){
          $http.get('/api/services')
               .success(function(res){
                   $scope.messages= res.data;
                   console.log($scope.messages);
               });
        }
    }]);

app.controller('cardCtrl', function($scope , dummydata) {
    
    $scope.test = "Testing the test";
    $scope.messages = dummydata.latestServices;
    console.log($scope.messages);

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
            if (response.status === 202) {
                window.location = '/';
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


app.service("dummydata", function() {
    this.latestServices = [
        {
            employer: "employer1",
            headline: "headline1",
            description: "Good",
            minRange: "10",
            maxRange: "20",
        },
       
 
        {
            employer: "employer2",
            headline: "Lorem ipsum dolor sit amet.",
            description: "Pizza",
            minRange: "10",
            maxRange: "20",
            
        },
        {
            employer: "employer3",
            headline: "Lorem ipsum dolor sit amet.",
            description: "Coke",
            minRange: "10",
            maxRange: "20",
        },
        {
            employer: "employer4",
            headline: "Lorem ipsum dolor sit amet.",
            description: "Fanta",
            minRange: "10",
            maxRange: "20",
        },
    ];
});