var app = angular.module('libra', ['ngMaterial']);

app.controller('TestController', function  () {
    this.name = 'Libra';
});

app.controller("ServiceController", function() {
    this.latestServices = [
        {
            headline: "Lorem ipsum dolor sit amet.",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat, lacus quis tristique venenatis, ante tellus iaculis justo, id elementum ante urna sed mi. Nam.",
            
        },
        {
            headline: "Lorem ipsum dolor sit amet.",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat, lacus quis tristique venenatis, ante tellus iaculis justo, id elementum ante urna sed mi. Nam.",
            
        },
        {
            headline: "Lorem ipsum dolor sit amet.",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat, lacus quis tristique venenatis, ante tellus iaculis justo, id elementum ante urna sed mi. Nam.",
        },   
        {
            headline: "Lorem ipsum dolor sit amet.",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat, lacus quis tristique venenatis, ante tellus iaculis justo, id elementum ante urna sed mi. Nam.",
    
        },
        {
            headline: "Lorem ipsum dolor sit amet.",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat, lacus quis tristique venenatis, ante tellus iaculis justo, id elementum ante urna sed mi. Nam.",
          
        },
        {
            headline: "Lorem ipsum dolor sit amet.",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis feugiat, lacus quis tristique venenatis, ante tellus iaculis justo, id elementum ante urna sed mi. Nam.",
         
        },
    ];
});

app.controller('UserController', ['$scope', '$http', '$window', function($scope, $http, $window){
    
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
            console.log(response);
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

app.controller('PopoverDemoCtrl', function ($scope) {
  $scope.dynamicPopover = {
    content: 'content',
    templateUrl: 'Job Discription',
    title: 'Headline'
  };

  $scope.placement = {
    options: [
      'Admin-office',
      'Customer Service',
      'Education',
      'Engineering',
      'Finance',
      'Food',
      'General Labor',
      'Government',
      'healthcare',
      'human resource',
      'legal',
      'marketing',
      'media',
      'reale state',
      'sales',
      'security',
      'software',
      'tech support',
      'transport',
      'TV'
    ],
    selected: 'top'
  };
});

app.directive("serviceCarouselDesc", function() {
    return {
        restrict: 'E',
        templateUrl: "/views/partials/serviceCarouselDesc.html"
    };
});



app.controller('cardCtrl', ['$scope','$http' ,function($scope, $http) {
    $http({
        method: 'GET',
        url: '/api/services'
    }).then(function successCallback(res){  
        this.messages = res.data;
     
    }, function errorCallback(res){
        console.log(res);
    });

}]);





app.controller('', function($scope , dummydata) {
    
    $scope.messages = dummydata.latestServices;
    console.log($scope.something);

});
app.service("dummydata",'$http' ,function($scope, $http) {
    $http({
        method: 'GET',
        url: '/services'
    }).then(function successCallback(res){  
        this.latestServices = res.data;
     
    }, function errorCallback(res){
        console.log(res);
    });

});