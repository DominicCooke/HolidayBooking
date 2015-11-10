tokenService = function () {
    var serviceToken;
    return {
        getToken: function () {
            return serviceToken;
        },
        setToken: function (token) {
            serviceToken = token;
        }
    };
}
