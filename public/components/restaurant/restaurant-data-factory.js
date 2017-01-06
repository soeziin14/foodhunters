angular.module('app').factory('restaurantDataFactory', restaurantDataFactory);

function restaurantDataFactory($http, $rootScope){

    var data = {
        restaurant: null,
    };

    return {
        getRestaurant: getRestaurant,
        recentRestaurants: recentRestaurants,
        showPioneeredRestaurants: showPioneeredRestaurants,
    }
    function getRestaurant(id) {
        return $http.get('/restaurant/'+id);
    }
    function recentRestaurants(){
        return $http.get('/restaurant/recent/'+9);
    }

    function showPioneeredRestaurants() {
        return $http.get('/restaurant/'+$rootScope.currentUser._id);
    }
}