angular.module('app').controller('SigninoutController', SigninoutController);

function SigninoutController($auth, API, $window, $scope, $rootScope, $location, jwtHelper, toaster) {

    $scope.isLoggedIn = function () {//console.log("is logged in?" , ($window.localStorage.currentUser ? true : false));
        return ($window.localStorage.currentUser ? true : false);
    };

    $scope.isAdmin = function() {
        return ($window.localStorage.currentUser.admin ? true: false);
    };

    $scope.getUserName = function () {//console.log("name: ", JSON.parse($window.localStorage.currentUser).fullName);
        return $rootScope.currentUser.fullName;
    };

    $scope.instagramLogin = function () {
        linkToAPI('instagram');
    };
    $scope.signin = function () {

        var user = {
            email: this.email,
            password: this.password
        }
        $auth.login({email: $scope.email, password: $scope.password})
            .then(function (response) {
                console.log("normal login: ", response);
                $window.localStorage.currentUser = JSON.stringify(response.data.user);
                $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
                toaster.pop('success', "", "Welcome back, " + $rootScope.currentUser.fullName);
                $location.path('/');
            })
            .catch(function (err) {
                toaster.pop("error", "Login Error", err.data.message.email);
            })
    };

    $scope.logOut = function () {
        $auth.logout();
        $window.localStorage.clear();
        $rootScope.currentUser = null;
    };

    $scope.getUsername = function () {
        return $rootScope.currentUser.displayName;
    };

    $scope.isActiveTab = function (url) {
        var currentPath = $location.path().split('/')[1];
        return (url === currentPath ? 'active' : '');
    };
}