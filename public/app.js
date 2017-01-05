var app = angular.module('app', ['ngResource', 'ngRoute', 'ngFileUpload', 'angularCSS', 'angular-jwt', 'ngCookies', 'toaster', 'satellizer', 'angular-input-stars']);

app.config(function($routeProvider, $authProvider) {

    $authProvider.loginOnSignup = false;
    $authProvider.instagram({
        clientId: 'e93389cd43464e6cbacc5a414b980f3f'
    });

    $authProvider.instagram({
        name: 'instagram',
        url: '/auth/instagram',
        authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
        redirectUri: window.location.origin,
        scope: ['basic'],
        scopeDelimiter: '+',
        oauthType: '2.0'
    });

    $routeProvider
        .when('/', {
            css:'components/main.css',
            templateUrl: 'components/main.html',
            controller: MainController,
        })
        .when('/login', {
            css: 'components/user/signinout/login.css',
            templateUrl: 'components/user/signinout/login.html',
            controller: SigninoutController,
        })
        .when('/signup', {
            css: 'components/user/signinout/login.css',
            templateUrl: 'components/user/signup/signup.html',
            controller: SignupController,
        })
        .when('/user/:id', {
            css: 'components/user/profile/profile.css',
            templateUrl: 'components/user/profile/profile.html',
            controller: ProfileController,
        })
        .when('/blog/index', {
            css: 'components/blog/blog.css',
            templateUrl: 'components/blog/index.html',
            controller: BlogController,
        })
        .when('/blog/new', {
            css: 'components/blog/new.css',
            templateUrl: 'components/blog/new.html',
            controller: BlogController,
        })
        .when('/blog/:id', {
            css: 'components/blog/new.css',
            templateUrl: 'components/blog/show.html',
            controller: BlogController,
        })
        .when('/restaurant/new', {
            css: 'components/restaurant/restaurant.css',
            templateUrl: 'components/restaurant/new.html',
            controller: RestaurantController,
        })
        .when('/admin/validateRestaurants', {
            templateUrl: 'components/user/admin/validateRestaurants.html',
            controller: AdminController,
        })
    ;
}).run(function($rootScope, $window, $auth) {console.log("authenticated? ", $auth.isAuthenticated());
    //if ($auth.isAuthenticated()) {console.log("authenticated: ", $auth.isAuthenticated());
    //    $rootScope.currentUser = $window.localStorage.currentUser;
    //}
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if($window.localStorage.currentUser) {
            $rootScope.currentUser = JSON.parse($window.localStorage.currentUser);
        }
        if($window.localStorage.photos) {
            $rootScope.photos = JSON.parse($window.localStorage.photos);
        }
    });
});
