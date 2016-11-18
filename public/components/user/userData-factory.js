angular.module('app').factory("userDataFactory", [
    "$cookies", function($auth, $window) {
        var fullName    = null,
            displayName = null,
            accessToken = null,
            loggedIn    = false;

        return {
            isLoggedIn: function() {
                return loggedIn;
            },
            setSessionData: function(fullname, displayname, accestoken, loggedin) {
                fullName    = fullname;
                displayName = displayname;
                accessToken = accestoken;
                loggedIn    = isloggedin;
            },
            getUserName: function() {
                return fullName;
            },
            getId: function() {
                return displayName
            },
            getToken: function() {
                return accessToken;
            },
            clearSessionData: function() {
                fullName = null,
                displayName = null,
                accessToken = null;
            }
        }
    }
]);