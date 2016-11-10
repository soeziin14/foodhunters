angular.module('app').directive('fhNavbar', fhNavbar);

function fhNavbar() {
    return {
        templateUrl: 'components/directive-navbar/navbar.html'
    };
}