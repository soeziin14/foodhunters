angular.module('app').controller('AdminController', AdminController);

function AdminController($http, $rootScope, $scope) {

    $scope.needValidations;

    $scope.getRestaurantsToValidate = function() {
        $http.get('/restaurant').then(function(response) {
            console.log('response: ', response);
            $scope.needValidations = response.data.restaurants;
            console.log("needValidations1111: ", $scope.needValidations);
        })
    };

    $scope.validate = function(rest, index) {console.log("rest: ", rest, " ## ", index);
        $http.put('/restaurant/'+rest._id).then(function(response) {
            $scope.needValidations.splice(index, index+1);
            console.log("needValidations: ", $scope.needValidations);
        })
            .catch(function(err) {
               //verify failed.
                console.log("err: ", err);
            });
    }

    $scope.reject = function() {

    }
}