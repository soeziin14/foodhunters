angular.module('app').controller('RestaurantController', RestaurantController);

function RestaurantController($http, $rootScope, $window, $scope, $location, jwtHelper, toaster, restaurantDataFactory, $routeParams) {
    $scope.addRestaurant = function () {

        var restaurant = {
            name: $scope.businessname,
            pioneer: $rootScope.currentUser.displayName,
            address: {
                street: $scope.street,
                city: $scope.city,
                state: $scope.state,
                country: $scope.country
            },
            phone: $scope.phone,
            email: $scope.email,
            website: $scope.website,
        }

        $http.post('/restaurant/new', restaurant).then(function (response) {
                console.log("Restaurant new success: ", response);
                $location.path('/');
            })
            .catch(function (err) {
                console.log("Restaurant new error: ", err);
            });
    },
    $scope.restaurant = function(){
        restaurantDataFactory.getRestaurant($routeParams.id).then(function(response){
            $scope.showRestaurant = response.data.restaurant;
        });
    }
}

