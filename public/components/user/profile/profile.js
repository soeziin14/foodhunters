angular.module('app').controller('ProfileController', ProfileController);

function ProfileController($http, $scope, $location, AuthFactory, cookieFactory, jwtHelper, toaster) {
console.log("here!");
    $scope.currentUser = null;

    $scope.setProfile = function(currentuser) {
        $scope.currentUser = currentuser;
    }
    $scope.getProfile = function() {
        $http.get('/api/CRUD/' + cookieFactory.getCookieId()).then(function (response) {
            if (response.data.success) {
                AuthFactory.isLoggedIn = true;
                $scope.currentUser = response.data.user;
            }

            if (response.data.wrongCredentials) {
                toaster.pop("error", "", response.data.wrongCredentials);
            }


        }).catch(function (error) {
            toaster.pop('error', "", error);
            //console.log(error);
        });
    }



    $scope.getInstagramUser = function() {
console.log("let's get it");
        $http.get('/api/auth/instagram').then(function (response) {
console.log("insta success? ", response);
            if (response.data.success) {
                AuthFactory.isLoggedIn = false;
                cookieFactory.clearCookieData();
                $location.path('/');
            }
        }).catch(function (error) {
            console.log(error);
        });
    }
    $scope.signout = function () {

        $http.get('/api/CRUD/signout').then(function (response) {

            if (response.data.success) {
                AuthFactory.isLoggedIn = false;
                cookieFactory.clearCookieData();
                $location.path('/');
            }
        }).catch(function (error) {
            console.log(error);
        });


    }

    $scope.isActiveTab = function (url) {
        var currentPath = $location.path().split('/')[1];
        return (url === currentPath ? 'active' : '');
    }
}

