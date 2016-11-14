angular.module('app').controller('ProfileController', ProfileController);

function ProfileController($auth, API, $rootScope, $window, $http, $scope, $location, cookieFactory, toaster) {
console.log("$rootScope: ", $rootScope.currentUser);
    if ($rootScope.currentUser && $rootScope.currentUser.displayName) {
       console.log("success valid, " ,$rootScope.currentUser.token);
        API.getFeed().success(function(data) {
            $scope.photos = data;console.log("SUCCESS??!?!:", data);
        });
    }
    //user = {
    //    email: this.email, //scope issues; have to use this.
    //    password: this.password
    //};

    //get profile aka user data
    //$http.get('/api/feed/' + $rootScope.currentUser.token).then(function (response) {
    //    if (response.data.success) {
    //
    //        console.log("media success:", response);
    //    } else {
    //        toaster.pop("error", "", "Invalid instagram or user authentication.");
    //    }
    //}).catch(function (error) {
    //    console.log('error', "", error);
    //});

    $scope.isActiveTab = function (url) {
        var currentPath = $location.path().split('/')[1];
        return (url === currentPath ? 'active' : '');
    }
}

