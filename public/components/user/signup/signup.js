angular.module('app').controller('SignupController', SignupController);

function SignupController($rootScope, $auth, $scope, $http, $window, $location,
                          jwtHelper, API, toaster) {

    var user = {};
    $scope.next = false;

    $scope.emailLogin = function () {
        $auth.login({email: this.email, password: this.password})
            .then(function (response) {
                $window.localStorage.currentUser = JSON.stringify(response.data.user);
                $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
            })
            .catch(function (response) {
                $scope.errorMessage = {};
                angular.forEach(response.data.message, function (message, field) {
                    $scope.loginForm[field].$setValidity('server', false);
                    $scope.errorMessage[field] = response.data.message[field];
                });
            });
    };
    $scope.signup = function () {
        user = {
            email: this.email, //scope issues; have to use this.
            password: this.password
        };
        $auth.signup(user)
            .then(function (response) {
                $scope.next = true;
            })
            .catch(function (response) {
                console.log("signup fail: ", response.data);
            });

    };

    $scope.linkInstagram = function (provider) {
console.log("wtf?", provider);
        $auth.authenticate(provider, user)
            .then(function(response) {
console.log("linksta response: ", reponse);
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
console.log("linkInsta token: ", token);
            console.log("linkInsta decode:", decoded);
            API.getFeed().success(function (data) {
                $scope.photos = data;console.log("success", data);
            });
            console.log("scope photos: ", $scope.photos);
            toaster.pop('success', "", "Welcome back " + user.displayName);
            console.log("path!!: ", $location.path());
            $location.path('/');
        }).catch(function(err) {
            console.log("failed linking instagram:", err);
        });
    };
}