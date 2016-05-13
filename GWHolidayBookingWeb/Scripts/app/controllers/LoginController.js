LoginController = function($scope, dataService, authService, userService) {
    "use strict";
    var vm = this;
    $scope.login = function() {
        authService.authenticateAccount($scope.username, $scope.password)
            .then(function(result) {
                if (result.data == true) {
                    userService.setUser();
                    loginService.setLoginStatus(true);
                } else {
                    $(".alert").show();
                    $("#password").val("");
                };
            });
    };
};
LoginController.$inject = ["$scope", "dataService", "authService", "userService"];