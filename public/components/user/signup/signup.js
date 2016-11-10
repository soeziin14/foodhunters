angular.module('app').controller('SignupController', SignupController);

function SignupController($http, $location) {
    var vm = this;

    vm.signup = function() {
        var user = {
            email       :  vm.email,
            firstname   :  vm.firstname,
            lastname    :  vm.lastname,
            username    :  vm.username,
            password    :  vm.password,
            address     :  vm.address
        };

        if (!vm.username || !vm.password) {
            vm.error = 'Please add a username and a password.';
        } else {
            if (vm.password !== vm.passwordrepeat) {
                vm.error = 'Please make sure the passwords match.';
            } else {
                $http.post('/api/CRUD/signup', user).then(function(result) {
                    vm.message = 'Successful registration, please login.';
                    vm.error = '';
                    $location.path('/');
                }).catch(function(error) {
                    console.log(error);
                });
            }
        }
    }
}