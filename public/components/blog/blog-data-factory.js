angular.module('app').factory('blogDataFactory', blogDataFactory);

function blogDataFactory($http, $rootScope){

    var blogs;
    var oneBlog;

    return {
        getAllUserBlogs: getAllUserBlogs,
        getOneUserBlog: getOneUserBlog,
        getRecentCountBlogs: getRecentCountBlogs,
    }

    function getAllUserBlogs() {
        return $http.get('/blogs/'+$rootScope.currentUser._id);
    }
    function getRecentCountBlogs(){
        return $http.get('/blogs/recent/'+9);
    }
    function getOneUserBlog(id) {
        return $http.get('/blogs/'+$rootScope.currentUser._id+'/'+id);
    }
}