loginService = function ($rootScope) {
    return {
        broadcast: function () {
            $rootScope.$broadcast("loggedIn");
        }
    };
}