angular.module('app').factory('blogDataFactory', blogDataFactory);

function blogDataFactory($http, $rootScope){

    var blogs;
    var oneBlog;

    return {
        blogList: blogList,
        blogShow: blogShow,
    }

    function blogList() {
        //if( blogs) {console.log("yes blogs");
        //    return blogs;
        //}
        return $http.get('/blog/'+$rootScope.currentUser._id);
    }

    function blogShow(id) {
        return $http.get('/blog/'+$rootScope.currentUser._id+'/'+id);
    }
}