loginService = function($rootScope) {
    "use strict";
    return {
        broadcast: function() {
            $rootScope.$broadcast("loggedIn");
        }
    };
}