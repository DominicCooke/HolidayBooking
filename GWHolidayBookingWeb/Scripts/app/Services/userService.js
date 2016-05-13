userService = function(dataService, loginService) {
    "use strict";
    var user;
    return {
        setUser: function() {
            dataService.employeeGetById()
                .then(function(response) {
                    user = response.data;
                    loginService.broadcast();
                });
        },
        employeeGetById: function() {
            return user;
        },
        refreshUser: function() {
            dataService.employeeGetById()
                .then(function(response) {
                    user = response.data;
                });
        }
    };
}