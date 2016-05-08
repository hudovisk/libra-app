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

        $http.get('/api/users/me').then(function(result) {
            $scope.me = result.data;
        });

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

    $scope.isOwnService = function(employerId) {
        return String(employerId) === String($scope.me._id);
    };

    $scope.bid = function(bid, eid) {
        $http({
            method: 'POST',
            url: '/api/services/'+eid+'/biddings',
            data: {
                user: $scope.me._id,
                explanation: bid.explanation,
                value: bid.value
            }
        }).then(function() {    
            $window.location.href = '/dashboard';
        });    
    };


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
                totalHours: serv.hours,
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

app.controller('BiddingCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window){

    $scope.isEmployer = false;

    this.init = function(serviceId, biddingId) {
        console.log(serviceId+' ===== '+biddingId);
        $http({
            method: 'GET',
            url: '/api/services/'+ serviceId,
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.service = response.data;
                console.log(response.data);   
            }
        }, function errorCallback(response) {
            console.log(response);
        }).then(function() {
            $http({
                method: 'GET',
                url: '/api/users/me'
            }).then(function successCallback(response) {
                if (response.status === 200) {
                    var userId = response.data._id;
                    $scope.isEmployer = String(userId) === String($scope.service.employer._id);
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
                $scope.bidding = response.data;
                console.log(response.data);   
            }
        }, function errorCallback(response) {
            console.log(response);
        });   

    };
    
    $scope.decline = function () {
        $http({
            method: 'DELETE',
            url: '/api/services/'+ $scope.service._id +'/biddings/'+$scope.bidding._id
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $window.location.href = '/dashboard';
            }
        }, function errorCallback(response) {
            console.log(response);
        });    
    }; //decline function

    $scope.accept = function () {
        console.log("Accept");
        $http({
            method: 'PUT',
            url: '/api/services/'+$scope.service._id+'/biddings/'+$scope.bidding._id+'/accept',
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
            url: '/api/services/'+$scope.service._id+'/counterOffer/'+$scope.bidding._id,
            data: {
                explanation: $scope.counter.explanation,
                value: $scope.counter.value,
                employee: $scope.bidding.user._id
            }
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $window.location.reload();
            }
        }, function errorCallback(response) {
            console.log(responde);
        });
    }; //accept function

}]);//controller

app.controller("ServiceController", ['$scope', '$http', '$window', function($scope, $http, $window) {

    $scope.review = {
        rating: '5'
    };

    $scope.isReviewEmployerAllowed = false;
    $scope.isReviewEmployeeAllowed = false;
    $scope.isFireEmployeeAllowed = false;

    $scope.isEmployer = false;

    var userId;

    this.init = function (serviceId, userId) {
        this.userId = userId;

        $http({
            method: 'GET',
            url: '/api/services/'+serviceId
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.service = response.data;
                $scope.isEmployer = String($scope.service.employer._id) === String(userId);
                $scope.isReviewEmployerAllowed = !$scope.service.employer_reviewed && 
                    (String(userId) === String($scope.service.employee._id));
                $scope.isReviewEmployeeAllowed = !$scope.service.employee_reviewed && 
                    (String(userId) === String($scope.service.employer._id));
                $scope.isFireEmployeeAllowed = String(userId) === String($scope.service.employer._id);
            }
        }, function errorCallback(response) {
            console.log(response);
        });

        $http({
            method: 'GET',
            url: '/api/services/'+serviceId+'/biddings'
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.biddings = response.data;
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    this.reviewEmployer = function() {
        $scope.userReview = $scope.service.employer;
    };

    this.reviewEmployee = function() {
        $scope.userReview = $scope.service.employee;
    };

    $scope.postReview = function() {
        $http({
            method: 'POST',
            url: '/api/users/'+$scope.userReview._id+'/reviews',
            data: {
                author: userId,
                service: $scope.service._id,
                rating: parseInt($scope.review.rating),
                text: $scope.review.text
            }
        }).then(function successCallback(response) {
            $window.location.reload();
        }, function errorCallback(response) {
            console.log(response);
        }); 
    };

    $scope.fireEmployee = function() {
        $http({
            method: 'PUT',
            url: '/api/services/'+$scope.service._id+'/fireEmployee'
        }).then(function successCallback(response) {
            $window.location.reload();
        }, function errorCallback(response) {
            console.log(response);
        }); 
    };

}]);

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

    $scope.payment = function (serviceId) {

        $http({
            method: 'PUT',
            url: '/api/services/'+serviceId+'/makePayment'
           
            }).then(function successCallback(response){
                $window.location = '/dashboard';
            },//success
            function errorCallback(response){

            });//errpr

           // });//then

    };//end if complete payment

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
            url: '/api/users/'+userId+'/reviews'
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.reviews = response.data;
                if($scope.reviews.length > 0) {
                    var sum = 0;
                    $scope.reviews.forEach(function(review) {
                        sum += review.rating;
                    });
                    $scope.profile.score = sum / $scope.reviews.length;
                } else {
                    $scope.profile.score = 0;
                }
            }
        }, function errorCallback(response) {
            console.log(response);
        });   

        $http({
            method: 'GET',
            url: '/api/services',
            params: {
                employee: userId,
            }
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.servicesOffered = response.data.docs;
            }
        }, function errorCallback(response) {
            console.log(response);
        });

        $http({
            method: 'GET',
            url: '/api/services',
            params: {
                employer: userId
            }
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.servicesRequested = response.data.docs;
            }
        }, function errorCallback(response) {
            console.log(response);
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

app.controller('DashboardController', ['$scope', '$http', '$window', function($scope, $http, $window){
    
    $scope.latestServices = [];

    $http({
            method: 'GET',
            url: '/api/users/me'
        }).then(function successCallback(response) {
            if (response.status === 200) {
                $scope.me = response.data;
                $http({
                    method: 'GET',
                    url: '/api/services',
                    params: {
                        sortBy: 'date',
                        page: 1,
                        pageSize: 3,
                        tags: $scope.me.interested_tags,
                        employee: 'null',
                    }
                }).then(function successCallback(response) {
                    if (response.status === 200) {
                        $scope.latestServices = response.data.docs;
                    }
                }, function errorCallback(response) {
                    console.log(response);
                });
            }
        }, function errorCallback(response) {
            console.log(response);
        });

    $scope.bid = function(bid, eid) {
        $http({
            method: 'POST',
            url: '/api/services/'+eid+'/biddings',
            data: {
                user: $scope.me._id,
                explanation: bid.explanation,
                value: bid.value
            }
        }).then(function() {    
            $window.location.href = '/dashboard';
        });    
    };    
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
                console.log($scope.user);
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
                'picture_url': $scope.user.picture_url,
                'interested_tags': $scope.user.interested_tags.map(function(tag) { return tag.text; }),
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