angular.module('app').controller('MainController', MainController);

function MainController(blogDataFactory, $scope){
    blogDataFactory.recentBlogs().then(function(response){
        $scope.recentBlogs = response.data.blogs;
    });
}