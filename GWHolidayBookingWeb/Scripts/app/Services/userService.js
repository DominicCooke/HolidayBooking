userService = function (dataService, loginService) {
    'use strict';
    var User;
    return {
        setUser: function () {
            dataService.employeeGetById().then(function (response) {
                User = response.data;
                loginService.broadcast();
            });
        },
        employeeGetById: function() {
            return User;
        },
        refreshUser: function() {
            dataService.employeeGetById().then(function (response) {
                User = response.data;
            });
        }
    };
}