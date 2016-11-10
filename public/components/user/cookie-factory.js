angular.module('app').factory("cookieFactory", [
    "$cookies", function($cookies) {
        var userName = "",
            ID       = null;

        return {
            setCookieData: function(username, id) {
                userName = username;
                ID       = id;
                $cookies.put("userName", userName);
                $cookies.put("ID", ID);
            },
            getCookieData: function() {
                userName = $cookies.get("userName");
                return userName;
            },
            getCookieId: function() {
                ID = $cookies.get("ID");
                return ID;
            },
            clearCookieData: function() {
                userName = "";
                $cookies.remove("userName");
            }
        }
    }
]);