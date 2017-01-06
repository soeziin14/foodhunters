angular.module('app').controller('MainController', MainController);

function MainController(blogDataFactory, restaurantDataFactory, $scope){
    blogDataFactory.recentBlogs().then(function(response){
        $scope.recentBlogs = response.data.blogs;
    });

    restaurantDataFactory.recentRestaurants().then(function(response){
        $scope.recentRestaurants = response.data.restaurants;
    });
    $scope.show = function(id){
        restaurantDataFactory.getRestaurant(id);
    }
}