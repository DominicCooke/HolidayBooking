userService = function (dataService, loginService) {
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
        }
    };
}