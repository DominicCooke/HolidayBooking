loginService = function($rootScope) {
    "use strict";
    var loginStatus = false;
    return {
        broadcast: function() {
            $rootScope.$broadcast("loggedIn");
        },
        setLoginStatus: function(status) {
            loginStatus = status;
            localStorage.setItem("loggedIn", status);
        },
        getLoginStatus: function() {
            return loginStatus;
        },
        checkLoginStatus: function() {
            return localStorage.getItem("loggedIn");
        }
    };
}