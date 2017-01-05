angular.module('app').factory('blogDataFactory', blogDataFactory);

function blogDataFactory($http, $rootScope){

    var blogs;
    var oneBlog;

    return {
        blogList: blogList,
        blogShow: blogShow,
        recentBlogs: recentBlogs,
    }

    function blogList() {
        //if( blogs) {console.log("yes blogs");
        //    return blogs;
        //}
        return $http.get('/blog/'+$rootScope.currentUser._id);
    }
    function recentBlogs(){
        return $http.get('/blog/recent/'+9);
    }
    function blogShow(id) {
        return $http.get('/blog/'+$rootScope.currentUser._id+'/'+id);
    }
}