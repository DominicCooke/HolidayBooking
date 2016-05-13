loginService = function($rootScope) {
    "use strict";
    var loginStatus = false;
    return {
        broadcast: function() {
            $rootScope.$broadcast("loggedIn");
        },
        setLoginStatus: function(status) {
            loginStatus = status;
        },
        getLoginStatus: function() {
            return loginStatus;
        }
    };
}