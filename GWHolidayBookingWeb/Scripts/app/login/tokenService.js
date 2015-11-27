tokenService = function () {
    'use strict';
    var loginAuthToken;
    var loginStatus = false;
    return {
        getLoginAuthToken: function() {
            return loginAuthToken;
        },
        setToken: function (token, status) {
            loginAuthToken = token;
            loginStatus = status;
        },
        getLoginStatus: function() {
            return loginStatus;
        }
    };
}