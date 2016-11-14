angular.module('app').controller('SigninoutController', SigninoutController);

function SigninoutController($auth, API, $http, $window, $scope, $rootScope, $location, jwtHelper, toaster) {


    $scope.isLoggedIn = function() {
        if ($window.localStorage.currentUser !== undefined) {
            return true;
        }
        return false;
    }

    $scope.getUserName = function() {
        return $rootScope.currentUser.displayName;
    }
    $scope.instagramLogin = function() {console.log('its here right');
        $auth.authenticate('instagram')
            .then(function(response) {
                console.log("linksta response: ", response);
                if(response.status == 409) {
                    toaster.pop("error",
                        'Please',
                        'This instagram account has already been linked.',
                        3000
                    );
                    return;
                }console.log("linksta data:", response.data);
                var user = response.data.user,
                    token = response.data.token,
                    decoded = jwtHelper.decodeToken(token);
                $window.localStorage.currentUser = JSON.stringify(response.data.user);
                $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
                $rootScope.currentUser.token = response.data.token;
                $location.path('/');
                console.log("linkInsta token: ", token);
                console.log("linkInsta decode:", decoded);
                API.getFeed(user.accessToken).success(function (data) {
                    $scope.photos = data;console.log("success", data);
                });
                console.log("scope photos: ", $scope.photos);
                toaster.pop('success', "", "Welcome back " + user.displayName);
                console.log("path!!: ", $location.path());
                $location.path('/');
            }).catch(function(err) {
            console.log("failed linking instagram22:", err);
        });
    };
    //$scope.login = function() {
    //    $auth.login({ email: $scope.email, password: $scope.password })
    //        .then(function(response) {console.log("signed in: ", response);
    //            API.getFeed()
    //                .then(function(data) {console.log("data: ", data);
    //                    $scope.photos = data;
    //                })
    //                .catch(function(hmm){
    //                    console.log("hmm", hmm);
    //                })
    //            ;
    //            $window.localStorage.currentUser = JSON.stringify(response.data.user);
    //            $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
    //            $rootScope.currentUser.token = response.data.token;
    //            $location.path('/');
    //        })
    //        .catch(function(response) {
    //            $scope.errorMessage = {};
    //            angular.forEach(response.data.message, function(message, field) {
    //                $scope.loginForm[field].$setValidity('server', false);
    //                $scope.errorMessage[field] = response.data.message[field];
    //            });
    //        });
    //
    //    $auth.link('instagram')
    //        .then(function(response) {
    //            $window.localStorage.currentUser = JSON.stringify(response.data.user);
    //            $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
    //            API.getFeed()
    //                .then(function(data) {console.log("data: ", data);
    //                $scope.photos = data;
    //            })
    //                .catch(function(hmm){
    //                    console.log("hmm", hmm);
    //                })
    //            ;
    //        })
    //        .catch(function(err) {
    //            console.log("link err: ", err);
    //        });
    //};

    $scope.logOut = function() {
        $auth.logout();
        $window.localStorage.clear();
        $rootScope.currentUser = null;
    };

    $scope.getUsername = function() {
        return $rootScope.currentUser.displayName;
    };

    $scope.isActiveTab = function(url) {
        var currentPath = $location.path().split('/')[1];
        return (url === currentPath ? 'active' : '');
    };
}