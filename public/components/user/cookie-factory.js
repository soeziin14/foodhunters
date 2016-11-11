angular.module('app').factory("cookieFactory", [
    "$cookies", function($cookies) {
        var userName = "",
            ID       = null,
            token    = null;

        return {
            setCookieData: function(username, id, token) {
                userName = username;
                ID       = id;
                $cookies.put("userName", userName);
                $cookies.put("ID", ID);
                $cookies.put("token", token);
            },
            getUserName: function() {
                userName = $cookies.get("userName");
                return userName;
            },
            getId: function() {
                ID = $cookies.get("ID");
                return ID;
            },
            getToken: function() {
                token = $cookies.get("token");
                return token;
            },
            clearCookieData: function() {
                userName = "";
                $cookies.remove("userName");
            }
        }
    }
]);