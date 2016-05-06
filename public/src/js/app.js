var app = angular.module('libra', ['hc.marked', 'ngFileUpload', 'ngTagsInput']);

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



app.controller('SearchController', ['$scope', '$http', '$window', function ($scope, $http, $window){
    
    $scope.query = "";
    $scope.page = 1;
    $scope.pageSize = 10;
    $scope.totalPages = 0;
    $scope.totalResults = 0;
    $scope.tags = [];
    $scope.sortBy = "relevance";

    this.init = function(query) {
        $scope.query = query;
        this.search();
    };

    this.search = function() {

        console.log($scope.sortBy);

        $http({
            method: 'GET',
            url: '/api/services',
            params: {
                q: $scope.query,
                tags: $scope.tags.map(function(tag) { return tag.text; }),
                sortBy: $scope.sortBy,
                page: $scope.page,
                pageSize: $scope.pageSize,
                minWage: $scope.minWage,
                maxWage: $scope.maxWage
            }
        }).then(function(result) {
                $scope.services = result.data.docs;
                $scope.page = result.data.page;
                $scope.totalPages = result.data.pages;
                $scope.totalResults = result.data.total;
        });
    };

    this.setPage = function(page) {
        $scope.page = page;
        this.search();
    };

    $scope.range = function(n) {
        return new Array(n);
    };

    $scope.bid = function(bid, eid) {

        var userid;
    $http.get('/api/users/me').then(function(result) {
        $scope.userId = result.data._id;
        userid = $scope.userId;
    });

        $http({
            method: 'POST',
            url: '/api/services/'+eid+'/biddings',
            data: {
                user: userid,
                explanation: bid.explanation,
                value: bid.value
            }
        }).then(function() {
                
                    $window.location.href = '/dashboard';
                    
               
            });    
        
    }


}]);//controller

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
                tags: serv.tags.map(function(tag) { return tag.text; }),
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

app.controller('BiddingCtrl', function ($scope, $http, $window){
   var test = $window.location.pathname;
   var vars = test.split("/");
    console.log( "aaa " + vars[1] + " " + vars[2] + " . " + vars[3]);
    var serviceId = vars[2];
    var biddingId = vars[3];
    var serviceownerid = "";

    $scope.headline = "";
    $scope.description = "";
    $scope.min = "";
    $scope.max = "";
    $scope.oldoffer = "";
    $scope.oldreason = "";
    $scope.applicantId = "";
    $scope.serviceowner = "";

   // console.log($scope.headline);

        $http({
            method: 'GET',
            url: '/api/services/'+ serviceId,
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.headline = response.data.headline;
                $scope.description = response.data.description;
                $scope.min = response.data.minRange;
                $scope.max = response.data.maxRange;
                serviceownerid = response.data.employer;
               console.log(response.data);
                
            }
        }, function errorCallback(response) {
            console.log(response);
        }).then(function(){
                $http({
                method: 'GET',
                url: '/api/users/'+serviceownerid
            }).then(function successCallback(response) {
                if (response.status === 200) {
                    $scope.serviceowner = response.data.name;
                    console.log(response.data);
                }
            }, function errorCallback(response) {
                console.log(response);
            });          

        });     


        $http({
            method: 'GET',
            url: '/api/services/'+ serviceId +'/biddings/'+biddingId,
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.applicantId = response.data.user;
                $scope.oldoffer = response.data.value;
                $scope.oldreason = response.data.explanation;
                console.log(response.data);
                
            }
        }, function errorCallback(response) {
            console.log(response);
        });    
        
         $scope.decline = function () {

                 $http({
                method: 'DELETE',
                url: '/api/services/'+ serviceId +'/biddings/'+biddingId
            }).then(function successCallback(response) {
                if (response.status === 200) {

                    $window.location.href = '/dashboard';
                    
                }
            }, function errorCallback(response) {
                console.log(response);
            });    
        

         }; //decline function

          $scope.accept = function () {
            $http({
                method: 'PUT',
                url: '/api/services/'+serviceId+'/biddings/'+biddingId,
                data: {
                    employee: $scope.applicantId,
                    money: ($scope.oldoffer / 2)
                }
            }).then(function successCallback(response) {
                if (response.status === 200) {
                    $window.location.reload();
                }
            }, function errorCallback(response) {
                console.log(responde);
            });
          }; //accept function

          $scope.counter = function (bid) {
            $http({
                method: 'PUT',
                url: '/api/services/'+serviceId+'/counterOffer/'+biddingId,
                data: {
                    employee: $scope.applicantId,
                    explanation: bid.explanation,
                    value: bid.value
                }
            }).then(function successCallback(response) {
                if (response.status === 200) {
                    $window.location.reload();
                }
            }, function errorCallback(response) {
                console.log(responde);
            });
          }; //accept function

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
        }
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

    $scope.loginFacebook = function() {
        $http({
            method: 'GET',
            url: '/api/users/login/facebook',
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

    $scope.login = function (user) {
        $http({
            method: 'POST',
            url: '/api/users/login',
            data: {
                email: user.email,
                password: user.password
            }
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $window.location.href = '/dashboard';
            }
            //TODO: Display duplicate email!
        }, function errorCallback(response) {
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
            if (response.status === 200) {
                $window.location.href = '/';
            }
        }, function errorCallback(response) {
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
    
    //pause/disable post
    $scope.disablePost =function(serviceId){

        $http({
            method: 'PUT',
            url: '/api/services/'+serviceId+'/pause'
        }).then(function successCallback(response) {
            alert("Post has been updated!");
        }, function errorCallback(response) {
            console.log(response);
        });//then         
    }; //end of disablepost

    $scope.delPost = function (serviceId){
        $http({
            method: 'DELETE',
            url: '/api/services/'+str
        }).then(function successCallback(response) {
            $window.location.reload();
        }, function errorCallback(response) {
            console.log(response);
        });//then        

    }; //delete the post

    this.init = function (userId) {
        parent = this;

        $http({
            method: 'GET',
            url: '/api/users/me'
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.me = response.data;
            }
        }, function errorCallback(response) {
            console.log(response);
        });    

        $http({
            method: 'GET',
            url: '/api/users/'+userId
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.profile = response.data;
                parent.originalDescription = $scope.profile.description;
            }
        }, function errorCallback(response) {
            console.log(response);
        });        

        $http({
            method: 'GET',
            url: '/api/services?employee='+userId
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.servicesOffered = response.data;
            }
        }, function errorCallback(response) {
            console.log(response);
        });

        $http({
            method: 'GET',
            url: '/api/services?employer='+userId
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.servicesRequested = response.data;
            }
        }, function errorCallback(response) {
            console.log(response);
        });

        $http({
            method: 'GET',
            url: '/api/users/'+userId+'/reviews'
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.reviews = response.data;
            }
        }, function errorCallback(response) {
            console.log(responde);
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
            if (response.status === 200) {
                $window.location.reload();
            }
        }, function errorCallback(response) {
            console.log(responde);
        });
    };

    this.connectedFb = function() {
        if ($scope.profile.fb_id) {
            return true;
        } else {
            return false;
        }
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
    };

}]);//end of profileController

app.controller('DashboardController', ['$scope', '$http', function($scope, $http){
    
    $scope.latestServicesRequested = [];
    $scope.latestServicesOffered = [];

    $http({
            method: 'GET',
            url: '/api/services',
            params: {
                sortBy: 'date',
                page: 1,
                pageSize: 5,
                employee: 'null'
            }
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.latestServicesRequested = response.data.docs;
            }
        }, function errorCallback(response) {
            console.log(response);
        });

    $http({
            method: 'GET',
            url: '/api/services/',
            params: {
                sortBy: 'date',
                page: 1,
                pageSize: 5,
                employer: 'null'
            }
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.latestServicesOffered = response.data.docs;
            }
        }, function errorCallback(response) {
            console.log(response);
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
            if (response.status === 200) {
                $scope.user = response.data;
            }
        }, function errorCallback(response) {
            console.log(response);
        });        

    };

    this.connectedFb = function() {
        if ($scope.user.fb_id) {
            return true;
        } else {
            return false;
        }
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
                if (response.status === 200) {
                    var url = response.data.url;
                    var signed_request = response.data.signed_request;

                    $scope.uploadFile(file, signed_request, url);
                }
            }, function errorCallback(response) {
                console.log(response);
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

app.controller('NotificationController', ['$scope', '$http', '$window', function($scope, $http, $window){
    
    $scope.notifications = [];
    this.unreadSize = 0;

    $scope.latestServicesOffered = [];

    $http({
            method: 'GET',
            url: '/api/users/me/notifications'
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.notifications = response.data;
            }
        }, function errorCallback(response) {
            console.log(response);
        });

    $scope.notificationAction = function(notification) {
        $http({
            method: 'PUT',
            url: '/api/users/me/notifications/'+notification._id+'/read'
        }).then(function successCallback(response) {
            if (response.status === 200) {
                console.log('Read success');
            }
        }, function errorCallback(response) {
            console.log(response);
        });
        $window.location.href = notification.action;
    };

}]);

app.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
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

app.directive('notificationWidget', function() {
    return {
        restrict: 'E',
        templateUrl: "/views/partials/notificationWidget.html"
    };
});

app.directive('searchJobItem', function() {
    return {
        restrict: 'E',
        templateUrl: "/views/partials/searchJobItem.html"
    };
});