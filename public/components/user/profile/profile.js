angular.module('app').controller('ProfileController', ProfileController);

function ProfileController($auth, API, $rootScope, $window, $http, $scope, $location, jwtHelper, toaster) {

    $scope.isAuthenticated = function () {
        return $auth.isAuthenticated();
    };

    $scope.connectInstagram = function () {
        console.log("heree");
        var user = $rootScope.currentUser;
        if (user.accessToken) {
            toaster.pop("error",
                "Account in Use.",
                "This instagram account is already in use. Either unlink the in-use account, or try another account.");
        } else {
            $auth.authenticate('instagram', user)
                .then(function (response) {
                    if (response.status == 409) {
                        toaster.pop("error",
                            'Please',
                            'This instagram account has already been linked.',
                            3000
                        );
                        return;
                    }
                    console.log("linksta data:", response.data);
                    var user = response.data.user,
                        token = response.data.token,
                        decoded = jwtHelper.decodeToken(token);
                    toaster.pop("success", "Link Successful.", "");
                    $window.localStorage.currentUser = JSON.stringify(response.data.user);
                    $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
                    $location.path('/');
                    API.getFeed(user.accessToken).success(function (data) {
                        $scope.photos = data;
                        console.log("success", data);
                    });
                    console.log("scope photos: ", $scope.photos);
                    console.log("path!!: ", $location.path());
                    $location.path('/');
                }).catch(function (err) {
                console.log("failed linking instagram22:", err);
            });
        }
    }

    //$scope.isActiveTab = function (url) {
    //    var currentPath = $location.path().split('/')[1];
    //    return (url === currentPath ? 'active' : '');
    //}
}

