angular.module('app')
    .factory('API', function($http) {

        return {
            getFeed: function(token) {
                return $http.get('http://localhost:3000/api/feed/' + token);
            },
            getMediaById: function(id) {
                return $http.get('http://localhost:3000/api/media/' + id);
            },
            likeMedia: function(id) {
                return $http.post('http://localhost:3000/api/like', { mediaId: id });
            }
        }

    });