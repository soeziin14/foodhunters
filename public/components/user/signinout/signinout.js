angular.module('app').controller('SigninoutController', SigninoutController);

function SigninoutController($auth, $http, $scope, $location, AuthFactory, cookieFactory, jwtHelper, toaster) {

    $scope.instagramSignin = function(provider) {
        $auth.authenticate(provider).then(function(response){
            AuthFactory.isLoggedIn = true;

            var user            = response.data.user,
                token           = response.data.token,
                decoded         = jwtHelper.decodeToken(token);
            cookieFactory.setCookieData(user.displayName, user._id, token);
            toaster.pop('success', "", "Welcome back " + user.displayName);console.log("path!!: ", $location.path());
            $location.path('/');
        });
    }

    $scope.isSignedIn = function() {
        if (cookieFactory.getUserName() == "" || cookieFactory.getUserName() == undefined) {
            return false;
        } else {
            return true;
        }
    }

    $scope.getUsername = function() {

        return cookieFactory.getUserName();
    }

    $scope.getUserId = function() {

        return cookieFactory.getId();
    }

    $scope.isActiveTab = function(url) {
        var currentPath = $location.path().split('/')[1];
        return (url === currentPath ? 'active' : '');
    }
}