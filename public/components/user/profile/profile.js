angular.module('app').controller('ProfileController', ProfileController);

function ProfileController($auth, API, $rootScope, $window, $scope, $location, jwtHelper, toaster) {

    $scope.photos = $rootScope.photos;
    console.log("rootscope: ", $rootScope.currentUser);
    console.log("rootscope.photos: ", $rootScope.currentUser.photos);
    console.log("scope.photos: ", $scope.photos);
    $scope.isAuthenticated = function () {
        return $auth.isAuthenticated();
    };

    $scope.connectInstagram = function () {
        console.log("heree");
        var user = $rootScope.currentUser;
        //if (user.accessToken) {
        //    toaster.pop("error",
        //        "Account in Use.",
        //        "This instagram account is already in use. Either unlink the in-use account, or try another account.");
        //} else {
            $auth.authenticate('instagram', user)
                .then(function (response) {
                    if (response.status == 409) {
                        toaster.pop("error",
                            'Please',
                            'This instagram account has already been linked.',
                            3000
                        );
                    }
                    console.log("linksta data:", response);
                    var user = response.data.user,
                        token = response.data.token,
                        decoded = jwtHelper.decodeToken(token);
                    toaster.pop("success", "Link Successful.", "");
                    $window.localStorage.currentUser = JSON.stringify(response.data.user);
                    $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
                    $location.path('/');
                    API.getFeed(user.accessToken).success(function (data) {
                        //$rootScope.currentUser.photos = data;
                        //$scope.photos = data;
                        $window.localStorage.photos = JSON.stringify(data);
                        $rootScope.photos = JSON.parse($window.localStorage.photos);
                        $scope.photos = $rootScope.photos;
                        //console.log("success", data);
                        //console.log("scope photos: ", $scope.photos);
                        console.log("rscope: ", $rootScope.currentUser);
                        console.log("rscope photos: ", $rootScope.currentUser.photos);
                    });

                }).catch(function (err) {
                console.log("failed linking instagram:", err);
            });
        }
    //}

    //$scope.isActiveTab = function (url) {
    //    var currentPath = $location.path().split('/')[1];
    //    return (url === currentPath ? 'active' : '');
    //}
}

