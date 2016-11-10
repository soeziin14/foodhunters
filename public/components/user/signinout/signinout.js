angular.module('app').controller('SigninoutController', SigninoutController);

function SigninoutController($auth, $http, $scope, $location, AuthFactory, cookieFactory, jwtHelper, toaster) {

    $scope.test = "";
    $scope.getInstagramUser = function(provider) {
        console.log("let's get it");
        $auth.authenticate(provider).then(function(response){
            console.log("response!" ,response);
        })
        //$http.jsonp('https://api.instagram.com/oauth/authorize/?client_id=e93389cd43464e6cbacc5a414b980f3f' +
        //    '&redirect_uri=http://localhost:3000&response_type=token')
        //    .then(function( response){
        //
        //        console.log('response!', response);
        //    })
        //$http({
        //    url:'/api/auth/instagram',
        //    dataType: 'jsonp',
        //    method: 'jsonp',
        //    data: '',
        //    headers: {
        //        "Content-Type": "application/javascript"
        //    }
        //}).success(function(response){
        //    console.log("succes:", response);
        //}).error(function(error){
        //    console.log("Errr:", error);
        //});
        //$http.jsonp('/api/auth/instagram', {jsonpCallbackParam: 'callback'}).then(function (response) {
        //    console.log("insta success? ", response);
        //    if (response.data.success) {
        //
        //    }
        //}).catch(function (error) {
        //    console.log("Failed Auth:", error);
        //});
    }
    $scope.isSignedIn = function() {
        if (cookieFactory.getCookieData() == "" || cookieFactory.getCookieData() == undefined) {
            return false;
        } else {
            return true;
        }
    }

    $scope.getUsername = function() {

        return cookieFactory.getCookieData();
    }

    $scope.getUserId = function() {

        return cookieFactory.getCookieId();
    }

    $scope.signin = function() {

        if ($scope.username && $scope.password) {
            var user = {
                username: $scope.username,
                password: $scope.password
            };

            $http.post('/api/CRUD/signin', user).then(function(response) {
                console.log(response);
                if (response.data.success) {
                    AuthFactory.isLoggedIn = true;
                    var token = response.data.token;
                    var decodedToken = jwtHelper.decodeToken(token),
                        decodedUser  = decodedToken.username,
                        decodedId    = decodedToken.id;
                    cookieFactory.setCookieData(decodedUser, decodedId);
                    toaster.pop('success', "", "Welcome back " + decodedUser);
                    $location.path('/');
                }

                if (response.data.wrongCredentials) {
                    toaster.pop("error", "", response.data.wrongCredentials);
                }


            }).catch(function(error) {
                toaster.pop('fail', "", "No such user exists");
                //console.log(error);
            });

        }
    }

    $scope.signout = function() {

        $http.get('/api/CRUD/signout').then(function(response){

            if (response.data.success) {
                AuthFactory.isLoggedIn = false;
                cookieFactory.clearCookieData();
                $location.path('/');
            }
        }).catch(function(error){
            console.log(error);
        });


    }

    $scope.isActiveTab = function(url) {
        var currentPath = $location.path().split('/')[1];
        return (url === currentPath ? 'active' : '');
    }
}