angular.module('app').controller('ProfileController', ProfileController);

function ProfileController($auth, $window, $http, $scope, $location, AuthFactory, cookieFactory, toaster) {

    $scope.currentUser = null;//console.log("!!! ", '/api/CRUD/' + cookieFactory.getId());
    $http.get('/api/CRUD/' + cookieFactory.getToken()).then(function (response) {
        if (response.data.success) {
            AuthFactory.isLoggedIn = true;
            $scope.currentUser = response.data.user;

        } else {
            toaster.pop("error", "", "Invalid instagram or user authentication.");
        }
    }).catch(function (error) {
        console.log('error', "", error);
    });

    $scope.signout = function () {

        AuthFactory.isLoggedIn = false;
        cookieFactory.clearCookieData();console.log("path!!: ", $location.path());
        $auth.logout();
        $window.location.href = '/'; // would really like to use $locaiton.path('/') here, but doesn't work??
    }

    $scope.isActiveTab = function (url) {
        var currentPath = $location.path().split('/')[1];
        return (url === currentPath ? 'active' : '');
    }
}

