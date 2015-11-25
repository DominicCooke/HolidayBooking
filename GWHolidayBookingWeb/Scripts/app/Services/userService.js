userService = function (dataService, loginService) {
    var User;
    return {
        setUser: function () {
            dataService.getUser().then(function (response) {
                User = response.data;
                loginService.broadcast();
            });
        },
        getUser: function() {
            return User;
        }
    };
}