var app = angular.module('libra', ['hc.marked', 'ngFileUpload']);

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
        }
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
                $window.location.href = '/dashboard';
            }
            //TODO: Display duplicate email!
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            if (response.status === 401) {
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

    $scope.profile = {};
    $scope.services = [];
    $scope.servicesRequested = [];
    $scope.servicesOffered = [];
    $scope.reviews = [];

    this.init = function (userId) {
        parent = this;
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

    this.connectedFb = function() {
        if ($scope.profile.fb_id) {
            return true;
        } else {
            return false;
        }
    }

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

}]);

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

app.controller('SettingsController', ['$scope', '$http', 'Upload', function($scope, $http, Upload){
    
    $scope.user = {};
    
    $scope.isUpdateProfileSuccess = false;
    $scope.isUpdateProfileFail = false;
    $scope.updateProfileFailMessage = "";
    $scope.isUpdateProfileProgress = false;

    $scope.isUpdatePasswordSuccess = false;
    $scope.isUpdatePasswordFail = false;
    $scope.updatePasswordFailMessage = "";
    $scope.isUpdatePasswordProgress = false;

    this.init = function (userId) {
        $scope.isUpdateProfileProgress = false;
        $scope.isUpdateProfileSuccess = false;
        $http({
            method: 'GET',
            url: '/api/users/me'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            if (response.status === 200) {
                $scope.user = response.data;
            }
        }, function errorCallback(response) {
            console.log(response);
        });        

    };

    $scope.uploadFile = function (file, signed_request, url) {
        $http({
            method: 'PUT',
            url: signed_request,
            data: file,
            headers: {
                'Content-Type': undefined,
                'x-amz-acl': 'public-read'
            }
        }).then(function successCallback(response) {
            $scope.user.picture_url = url;
        }, function errorCallback(response) {
            console.log(response);
        });    
    };

    $scope.getUrl = function (file) {
        if(file) {
            $http({
                method: 'GET',
                url: '/sign_s3?file_name='+file.name+'&file_type='+file.type
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                if (response.status === 200) {
                    var url = response.data.url;
                    var signed_request = response.data.signed_request;

                    $scope.uploadFile(file, signed_request, url);
                }
            }, function errorCallback(response) {
                console.log(response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            }); 
        }
    };

    $scope.updateProfile = function() {
        $scope.isUpdateProfileProgress = true;
        $scope.isUpdateProfileFail = false;
        $scope.isUpdateProfileSuccess = false;
        $http({
            method: 'PUT',
            url: '/api/users/me',
            data: {
                'name' : $scope.user.name,
                'email' : $scope.user.email,
                'picture_url': $scope.user.picture_url
            }
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.isUpdateProfileProgress = false;
                $scope.isUpdateProfileSuccess = true;
            }
        }, function errorCallback(response) {
            console.log(response);
            $scope.isUpdateProfileProgress = false;
            $scope.isUpdateProfileFail = true;
            $scope.updateProfileFailMessage = response.data.message;
        });   
    };

    $scope.updatePassword = function() {
        $scope.isUpdatePasswordProgress = true;
        $scope.isUpdatePasswordFail = false;
        $scope.isUpdatePasswordSuccess = false;
        $http({
            method: 'PUT',
            url: '/api/users/me/password',
            data: {
                'password' : $scope.currentPassword,
                'newPassword' : $scope.newPassword,
            }
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.isUpdatePasswordProgress = false;
                $scope.isUpdatePasswordSuccess = true;
            }
        }, function errorCallback(response) {
            console.log(response);
            $scope.isUpdatePasswordProgress = false;
            $scope.isUpdatePasswordFail = true;
            $scope.updatePasswordFailMessage = response.data.message;
        });   
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