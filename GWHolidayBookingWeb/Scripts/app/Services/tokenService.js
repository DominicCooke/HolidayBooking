tokenService = function() {
    var serviceToken;
    var LoginStatus = false;
    return {
        getToken: function() {
            return serviceToken;
        },
        setToken: function (token, loginStatus) {
            serviceToken = token;
            LoginStatus = loginStatus;
        },
        getLoginStatus: function() {
            return LoginStatus;
        }
    };
}