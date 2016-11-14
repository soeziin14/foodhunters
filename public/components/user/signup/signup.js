angular.module('app').controller('SignupController', SignupController);

function SignupController($rootScope, $auth, $scope, $http, $window, $location,
                          jwtHelper, API, toaster) {

    var user = {};
    $scope.signup = function () {
        user = {
            fullName: this.firstname + " " + this.lastname,
            email: this.email, //scope issues; have to use 'this' instead of $scope.
            password: this.password
        };
        $auth.signup(user)
            .then(function (response) {
                toaster.pop("success", "Signed Up", "Please Login to continue");
                $location.path('/');
            })
            .catch(function (response) {
                console.log("signup fail: ", response.data);
            });

    };
}