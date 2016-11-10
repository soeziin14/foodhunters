var app = angular.module('app', ['ngResource', 'ngRoute', 'angularCSS', 'angular-jwt', 'ngCookies', 'toaster', 'satellizer']);

app.config(function($routeProvider, $authProvider) {

    $authProvider.instagram({
        clientId: 'e93389cd43464e6cbacc5a414b980f3f'
    });

    $authProvider.instagram({
        name: 'instagram',
        url: '/auth/instagram',
        authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
        redirectUri: window.location.origin,
        requiredUrlParams: ['scope'],
        scope: ['basic'],
        scopeDelimiter: '+',
        oauthType: '2.0'
    });

    $routeProvider
        .when('/', {
            templateUrl: 'components/main.html',

        })
        .when('/signin', {
            css: 'components/user/signinout/signin.css',
            templateUrl: 'components/user/signinout/signin.html',
            controller: SigninoutController,
            controlelrAs: 'vm'
        })
        .when('/signup', {
            css: 'components/user/signup/signup.css',
            templateUrl: 'components/user/signup/signup.html',
            controller: SignupController,
            controllerAs: 'vm'
        })
        .when('/user/:id', {
            css: 'components/user/profile/profile.css',
            templateUrl: 'components/user/profile/profile.html',
            controller: ProfileController,
            controllerAs: 'vm'
        })
        .when('/api/auth/instagram/callback*', {
            css: 'components/user/profile/profile.css',
            templateUrl: 'components/user/profile/profile.html',
            controller: ProfileController,
            controllerAs: 'vm'
        })
    ;
});
